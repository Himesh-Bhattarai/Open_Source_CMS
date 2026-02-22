const args = process.argv.slice(2);

const getArg = (flag, fallback) => {
  const match = args.find((arg) => arg.startsWith(`${flag}=`));
  if (!match) return fallback;
  return match.slice(flag.length + 1);
};

const target = args[0] || process.env.PERF_TARGET_URL || "http://127.0.0.1:5000/health";
const thresholdMs = Number(getArg("--threshold", process.env.PERF_TTFB_THRESHOLD_MS || 500));
const samples = Number(getArg("--samples", process.env.PERF_SAMPLE_COUNT || 7));

if (!Number.isFinite(thresholdMs) || thresholdMs <= 0) {
  throw new Error("Invalid threshold. Use --threshold=<milliseconds>.");
}

if (!Number.isFinite(samples) || samples < 1) {
  throw new Error("Invalid sample count. Use --samples=<count>.");
}

const ttfbValues = [];

for (let index = 0; index < samples; index += 1) {
  const startedAt = performance.now();
  const response = await fetch(target, {
    method: "GET",
    cache: "no-store",
  });
  const ttfb = performance.now() - startedAt;
  ttfbValues.push(ttfb);

  if (!response.ok) {
    throw new Error(`Request failed on sample ${index + 1}: HTTP ${response.status}`);
  }
}

const sorted = [...ttfbValues].sort((a, b) => a - b);
const average = ttfbValues.reduce((sum, value) => sum + value, 0) / ttfbValues.length;
const percentile95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];

console.log(`Target: ${target}`);
console.log(`Samples: ${samples}`);
console.log(`TTFB avg: ${average.toFixed(2)}ms`);
console.log(`TTFB p95: ${percentile95.toFixed(2)}ms`);
console.log(`Threshold: ${thresholdMs}ms`);

if (percentile95 > thresholdMs) {
  console.error(`FAIL: p95 TTFB ${percentile95.toFixed(2)}ms exceeds ${thresholdMs}ms`);
  process.exit(1);
}

console.log("PASS: TTFB threshold met.");
