import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import PuppeteerHarImport from "puppeteer-har";

const PuppeteerHar = PuppeteerHarImport.default || PuppeteerHarImport;
const args = process.argv.slice(2);

const getArg = (flag, fallback) => {
  const directMatch = args.find((arg) => arg.startsWith(`${flag}=`));
  if (directMatch) {
    return directMatch.slice(flag.length + 1);
  }

  const flagIndex = args.indexOf(flag);
  if (flagIndex >= 0 && args[flagIndex + 1]) {
    return args[flagIndex + 1];
  }

  return fallback;
};

const toMs = (secondsValue) => Math.max(0, Number(secondsValue || 0) * 1000);
const toBytes = (value) => Math.max(0, Number(value || 0));
const formatMs = (value) => `${Number(value || 0).toFixed(2)} ms`;
const formatBytes = (value) => {
  const bytes = Number(value || 0);
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes.toFixed(0)} B`;
};

const baseName = String(getArg("--output", "perf-report")).replace(/\.(json|har)$/i, "");
const outputBase = path.resolve(process.cwd(), baseName);
const outputDir = path.dirname(outputBase);
const outputJsonFile = `${outputBase}.json`;
const outputHarFile = `${outputBase}.har`;
const targetUrl = String(getArg("--url", "http://localhost:3000")).trim();

if (!targetUrl) {
  throw new Error("Missing --url value. Example: --url http://localhost:3000");
}

const requestsById = new Map();
const requests = [];

const normalizeResourceType = (entry) => {
  const mimeType = String(entry.mimeType || "").toLowerCase();
  const resourceType = String(entry.resourceType || "").toLowerCase();
  const resourceUrl = String(entry.url || "").toLowerCase();

  if (
    resourceType === "script" ||
    mimeType.includes("javascript") ||
    /\.m?js($|\?)/.test(resourceUrl)
  ) {
    return "js";
  }

  if (
    resourceType === "stylesheet" ||
    mimeType.includes("css") ||
    /\.css($|\?)/.test(resourceUrl)
  ) {
    return "css";
  }

  if (
    resourceType === "image" ||
    mimeType.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|svg|avif|ico)($|\?)/.test(resourceUrl)
  ) {
    return "img";
  }

  if (
    resourceType === "font" ||
    mimeType.includes("font") ||
    /\.(woff2?|ttf|otf|eot)($|\?)/.test(resourceUrl)
  ) {
    return "fonts";
  }

  return "other";
};

const estimateFirstCpuIdle = (longTasks, startPoint) => {
  const minimumQuietWindowMs = 500;
  const safeStart = Number(startPoint || 0);
  const tasks = (Array.isArray(longTasks) ? longTasks : [])
    .filter((task) => Number(task.duration || 0) >= 50)
    .map((task) => ({
      start: Number(task.start || 0),
      end: Number(task.end || Number(task.start || 0) + Number(task.duration || 0)),
    }))
    .sort((a, b) => a.start - b.start);

  if (tasks.length === 0) {
    return safeStart;
  }

  let cursor = safeStart;
  for (const task of tasks) {
    if (task.end <= cursor) continue;
    if (task.start - cursor >= minimumQuietWindowMs) {
      return cursor;
    }
    cursor = Math.max(cursor, task.end);
  }

  return cursor;
};

const buildSuggestions = ({
  totalRequests,
  failedRequests,
  totalTransferBytes,
  lcpMs,
  domContentLoadedMs,
  loadEventMs,
  jsExecutionTimeMs,
  slowestResources,
  longestBlockingScripts,
}) => {
  const suggestions = [];

  if (totalRequests > 120) {
    suggestions.push(
      "High request count detected. Bundle, inline critical assets, and remove unused dependencies.",
    );
  }

  if (totalTransferBytes > 3 * 1024 * 1024) {
    suggestions.push(
      "Large transfer size detected. Enable compression, optimize media, and serve modern image formats.",
    );
  }

  if (Number(lcpMs || 0) > 2500) {
    suggestions.push(
      "LCP is slow. Prioritize the largest above-the-fold element, preload hero assets, and trim render-blocking CSS.",
    );
  }

  if (Number(domContentLoadedMs || 0) > 2000 || Number(loadEventMs || 0) > 3500) {
    suggestions.push(
      "Page lifecycle events are delayed. Reduce synchronous JavaScript and defer non-critical third-party scripts.",
    );
  }

  if (Number(jsExecutionTimeMs || 0) > 1500) {
    suggestions.push(
      "JavaScript execution time is high. Apply route-level code splitting and remove heavy runtime work on startup.",
    );
  }

  if ((longestBlockingScripts[0]?.durationMs || 0) > 300) {
    suggestions.push(
      "Long blocking scripts detected. Split large bundles and move expensive logic to Web Workers when possible.",
    );
  }

  if ((slowestResources[0]?.durationMs || 0) > 1000) {
    suggestions.push(
      "Some resources are very slow. Add CDN caching, optimize server latency, and preload critical assets.",
    );
  }

  if (Number(failedRequests || 0) > 0) {
    suggestions.push(
      "Some requests failed during load. Resolve failing API calls, missing assets, and CORS/network errors first.",
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "No critical bottlenecks detected. Continue monitoring p95/p99 metrics and regression-test before release.",
    );
  }

  return suggestions;
};

await fs.mkdir(outputDir, { recursive: true });

let browser;
let har;

try {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  await client.send("Network.enable");
  await client.send("Performance.enable");

  await page.evaluateOnNewDocument(() => {
    globalThis.__perfCollector = {
      lcp: 0,
      paints: {},
      longTasks: [],
    };

    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          globalThis.__perfCollector.lcp = entry.startTime;
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Ignore unsupported APIs.
    }

    try {
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          globalThis.__perfCollector.paints[entry.name] = entry.startTime;
        }
      });
      paintObserver.observe({ type: "paint", buffered: true });
    } catch {
      // Ignore unsupported APIs.
    }

    try {
      const longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          globalThis.__perfCollector.longTasks.push({
            start: entry.startTime,
            duration: entry.duration,
            end: entry.startTime + entry.duration,
            name: entry.name,
          });
        }
      });
      longTaskObserver.observe({ type: "longtask", buffered: true });
    } catch {
      // Ignore unsupported APIs.
    }
  });

  client.on("Network.requestWillBeSent", (event) => {
    const previous = requestsById.get(event.requestId);

    if (previous && event.redirectResponse) {
      previous.status = event.redirectResponse.status || previous.status;
      previous.mimeType = event.redirectResponse.mimeType || previous.mimeType;
      previous.endTime = event.timestamp;
      previous.durationMs = toMs(event.timestamp - previous.startTime);
      previous.transferSize = toBytes(event.redirectResponse.encodedDataLength);
      requests.push(previous);
      requestsById.delete(event.requestId);
    }

    requestsById.set(event.requestId, {
      id: event.requestId,
      url: event.request.url,
      method: event.request.method,
      initiatorType: event.initiator?.type || "other",
      resourceType: "other",
      mimeType: "",
      status: null,
      failed: false,
      errorText: "",
      fromCache: false,
      startTime: event.timestamp,
      endTime: event.timestamp,
      durationMs: 0,
      transferSize: 0,
    });
  });

  client.on("Network.responseReceived", (event) => {
    const current = requestsById.get(event.requestId);
    if (!current) return;

    current.resourceType = event.type || current.resourceType;
    current.status = event.response?.status || current.status;
    current.mimeType = event.response?.mimeType || current.mimeType;
    current.fromCache = Boolean(
      event.response?.fromDiskCache ||
      event.response?.fromServiceWorker ||
      event.response?.fromPrefetchCache ||
      event.response?.fromMemoryCache,
    );
  });

  client.on("Network.loadingFinished", (event) => {
    const current = requestsById.get(event.requestId);
    if (!current) return;

    current.endTime = event.timestamp;
    current.durationMs = toMs(event.timestamp - current.startTime);
    current.transferSize = toBytes(event.encodedDataLength);

    requests.push(current);
    requestsById.delete(event.requestId);
  });

  client.on("Network.loadingFailed", (event) => {
    const current = requestsById.get(event.requestId);
    if (!current) return;

    current.failed = true;
    current.errorText = event.errorText || "";
    current.endTime = event.timestamp || current.endTime;
    current.durationMs = toMs(current.endTime - current.startTime);

    requests.push(current);
    requestsById.delete(event.requestId);
  });

  har = new PuppeteerHar(page);
  await har.start({ path: outputHarFile });

  const gotoStartMs = performance.now();
  await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const gotoEndMs = performance.now();

  await har.stop();

  for (const pendingRequest of requestsById.values()) {
    requests.push(pendingRequest);
  }
  requestsById.clear();

  const browserTimings = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const collector = globalThis.__perfCollector || { lcp: 0, paints: {}, longTasks: [] };

    return {
      domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? 0,
      loadEventMs: navigation?.loadEventEnd ?? 0,
      domInteractiveMs: navigation?.domInteractive ?? 0,
      responseEndMs: navigation?.responseEnd ?? 0,
      lcpMs: collector.lcp || 0,
      firstPaintMs: collector.paints?.["first-paint"] || 0,
      firstContentfulPaintMs: collector.paints?.["first-contentful-paint"] || 0,
      longTasks: Array.isArray(collector.longTasks) ? collector.longTasks : [],
    };
  });

  const performanceMetrics = await client.send("Performance.getMetrics");
  const metricsMap = {};
  for (const metric of performanceMetrics.metrics || []) {
    metricsMap[metric.name] = metric.value;
  }

  const jsExecutionTimeMs = Number(metricsMap.ScriptDuration || 0) * 1000;
  const totalTaskDurationMs = Number(metricsMap.TaskDuration || 0) * 1000;
  const firstCpuIdleMs = estimateFirstCpuIdle(
    browserTimings.longTasks,
    browserTimings.firstContentfulPaintMs || browserTimings.domContentLoadedMs || 0,
  );

  const typedRequestCounts = { js: 0, css: 0, img: 0, fonts: 0, other: 0 };
  for (const request of requests) {
    const type = normalizeResourceType(request);
    typedRequestCounts[type] += 1;
    request.normalizedType = type;
  }

  const totalTransferBytes = requests.reduce(
    (sum, request) => sum + toBytes(request.transferSize),
    0,
  );
  const totalRequests = requests.length;
  const failedRequests = requests.filter(
    (request) => request.failed || request.status === null || Number(request.status || 0) >= 400,
  ).length;
  const totalLoadTimeMs = gotoEndMs - gotoStartMs;

  const slowestResources = [...requests]
    .sort((a, b) => b.durationMs - a.durationMs)
    .slice(0, 10)
    .map((request) => ({
      url: request.url,
      type: request.normalizedType,
      status: request.status,
      durationMs: Number(request.durationMs.toFixed(2)),
      transferSize: request.transferSize,
      transferSizeHuman: formatBytes(request.transferSize),
      fromCache: request.fromCache,
    }));

  const longestBlockingScripts = [...requests]
    .filter((request) => request.normalizedType === "js")
    .sort((a, b) => b.durationMs - a.durationMs)
    .slice(0, 10)
    .map((request) => ({
      url: request.url,
      durationMs: Number(request.durationMs.toFixed(2)),
      transferSize: request.transferSize,
      transferSizeHuman: formatBytes(request.transferSize),
      estimatedBlockingTimeMs: Number(Math.max(0, request.durationMs - 50).toFixed(2)),
    }));

  const report = {
    url: targetUrl,
    generatedAt: new Date().toISOString(),
    outputs: {
      json: outputJsonFile,
      har: outputHarFile,
    },
    summary: {
      totalPageLoadTimeMs: Number(totalLoadTimeMs.toFixed(2)),
      totalPageLoadTime: formatMs(totalLoadTimeMs),
      totalRequests,
      failedRequests,
      successfulRequests: Math.max(0, totalRequests - failedRequests),
      totalTransferredBytes: totalTransferBytes,
      totalTransferred: formatBytes(totalTransferBytes),
      domContentLoadedMs: Number(browserTimings.domContentLoadedMs.toFixed(2)),
      loadEventMs: Number(browserTimings.loadEventMs.toFixed(2)),
      lcpMs: Number(browserTimings.lcpMs.toFixed(2)),
      firstCpuIdleMs: Number(firstCpuIdleMs.toFixed(2)),
      jsExecutionTimeMs: Number(jsExecutionTimeMs.toFixed(2)),
      totalTaskDurationMs: Number(totalTaskDurationMs.toFixed(2)),
    },
    countsByType: typedRequestCounts,
    slowestResources,
    longestBlockingScripts,
    timingBreakdown: {
      domInteractiveMs: Number(browserTimings.domInteractiveMs.toFixed(2)),
      responseEndMs: Number(browserTimings.responseEndMs.toFixed(2)),
      firstPaintMs: Number(browserTimings.firstPaintMs.toFixed(2)),
      firstContentfulPaintMs: Number(browserTimings.firstContentfulPaintMs.toFixed(2)),
    },
    networkRequests: requests.map((request) => ({
      url: request.url,
      method: request.method,
      type: request.normalizedType,
      resourceType: request.resourceType,
      status: request.status,
      durationMs: Number(request.durationMs.toFixed(2)),
      transferSize: request.transferSize,
      transferSizeHuman: formatBytes(request.transferSize),
      fromCache: request.fromCache,
      failed: request.failed,
      errorText: request.errorText || "",
    })),
    suggestions: buildSuggestions({
      totalRequests,
      failedRequests,
      totalTransferBytes,
      lcpMs: browserTimings.lcpMs,
      domContentLoadedMs: browserTimings.domContentLoadedMs,
      loadEventMs: browserTimings.loadEventMs,
      jsExecutionTimeMs,
      slowestResources,
      longestBlockingScripts,
    }),
  };

  await fs.writeFile(outputJsonFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("Performance analysis complete");
  console.log(`URL: ${report.url}`);
  console.log(`HAR: ${outputHarFile}`);
  console.log(`Report: ${outputJsonFile}`);
  console.log(`Total page load: ${report.summary.totalPageLoadTime}`);
  console.log(`DOMContentLoaded: ${formatMs(report.summary.domContentLoadedMs)}`);
  console.log(`Load event: ${formatMs(report.summary.loadEventMs)}`);
  console.log(`LCP: ${formatMs(report.summary.lcpMs)}`);
  console.log(`First CPU idle: ${formatMs(report.summary.firstCpuIdleMs)}`);
  console.log(`JS execution: ${formatMs(report.summary.jsExecutionTimeMs)}`);
  console.log(`Requests: ${report.summary.totalRequests}`);
  console.log(`Failed requests: ${report.summary.failedRequests}`);
  console.log(`Transferred: ${report.summary.totalTransferred}`);
} catch (error) {
  try {
    if (har) {
      await har.stop();
    }
  } catch {
    // Ignore HAR stop errors.
  }

  console.error("Performance analysis failed.");
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close();
  }
}
