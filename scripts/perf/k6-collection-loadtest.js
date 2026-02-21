import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.1.0/index.js";

const BASE_URL = String(__ENV.BASE_URL || "http://localhost:5000").replace(/\/+$/, "");
const COLLECTION_FILE = String(__ENV.COLLECTION_FILE || "collection.json");
const INCLUDE_WRITE = String(__ENV.INCLUDE_WRITE || "false").toLowerCase() === "true";
const TARGET_USERS = Number(__ENV.TARGET_USERS || 20000);
const BATCH_USERS = Number(__ENV.BATCH_USERS || 1000);
const RAMP_STEP = String(__ENV.RAMP_STEP || "30s");
const HOLD_DURATION = String(__ENV.HOLD_DURATION || "10m");
const RAMP_DOWN = String(__ENV.RAMP_DOWN || "60s");
const REQUEST_TIMEOUT = String(__ENV.REQUEST_TIMEOUT || "60s");
const THINK_TIME_SECONDS = Number(__ENV.THINK_TIME_SECONDS || 0.1);
const OUT_PREFIX = String(__ENV.OUT_PREFIX || "k6-loadtest-results");
const AUTH_TOKEN = String(__ENV.AUTH_TOKEN || "");
const MAX_ENDPOINTS = Number(__ENV.MAX_ENDPOINTS || 0);

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const VALID_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]);

const apiErrorRate = new Rate("api_error_rate");
const throughputCounter = new Counter("api_requests_total");
const responseTimeTrend = new Trend("api_response_time_ms");

const collectionRaw = open(COLLECTION_FILE);
const collectionParsed = JSON.parse(collectionRaw);
const collectionVariables = buildVariables(collectionParsed);

const collectionRequests = isOpenApi(collectionParsed)
  ? extractOpenApiRequests(collectionParsed, collectionVariables)
  : extractPostmanRequests(collectionParsed, collectionVariables);

const dedupedRequests = dedupeRequests(collectionRequests);
const finalRequests = MAX_ENDPOINTS > 0 ? dedupedRequests.slice(0, MAX_ENDPOINTS) : dedupedRequests;

if (finalRequests.length === 0) {
  throw new Error(
    "No endpoints were extracted from the collection. Check COLLECTION_FILE and BASE_URL settings.",
  );
}

const stages = buildStages(TARGET_USERS, BATCH_USERS, RAMP_STEP, HOLD_DURATION, RAMP_DOWN);

export const options = {
  scenarios: {
    controlled_batches: {
      executor: "ramping-vus",
      startVUs: 0,
      stages,
      gracefulRampDown: RAMP_DOWN,
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<2000", "p(99)<5000"],
    api_error_rate: ["rate<0.05"],
  },
};

function isOpenApi(doc) {
  return typeof doc?.openapi === "string" || typeof doc?.swagger === "string";
}

function buildVariables(doc) {
  const variables = {};

  if (Array.isArray(doc?.variable)) {
    for (const variable of doc.variable) {
      if (variable && typeof variable.key === "string") {
        variables[variable.key] = String(variable.value ?? "");
      }
    }
  }

  variables.baseUrl = variables.baseUrl || BASE_URL;
  variables.baseURL = variables.baseURL || BASE_URL;
  variables.host = variables.host || BASE_URL;

  return variables;
}

function replaceVariables(input, variables) {
  return String(input || "").replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      return variables[key];
    }
    return "";
  });
}

function ensureAbsoluteUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `http:${value}`;
  if (value.startsWith("/")) return `${BASE_URL}${value}`;
  return `${BASE_URL}/${value}`;
}

function buildStages(targetUsers, batchUsers, rampStep, holdDuration, rampDown) {
  const stagesList = [];
  const safeTarget = Math.max(1, Number(targetUsers || 1));
  const safeBatch = Math.max(1, Number(batchUsers || 1));
  let current = 0;

  while (current < safeTarget) {
    current = Math.min(safeTarget, current + safeBatch);
    stagesList.push({ duration: rampStep, target: current });
  }

  stagesList.push({ duration: holdDuration, target: safeTarget });
  stagesList.push({ duration: rampDown, target: 0 });

  return stagesList;
}

function extractPostmanUrl(urlValue, variables) {
  if (!urlValue) return "";

  if (typeof urlValue === "string") {
    return ensureAbsoluteUrl(replaceVariables(urlValue, variables));
  }

  if (typeof urlValue?.raw === "string") {
    return ensureAbsoluteUrl(replaceVariables(urlValue.raw, variables));
  }

  const protocol = urlValue.protocol || "http";
  const host = Array.isArray(urlValue.host) ? urlValue.host.join(".") : String(urlValue.host || "");
  const path = Array.isArray(urlValue.path) ? urlValue.path.join("/") : String(urlValue.path || "");

  const query = Array.isArray(urlValue.query)
    ? urlValue.query
        .filter((item) => item?.key)
        .map(
          (item) =>
            `${encodeURIComponent(item.key)}=${encodeURIComponent(
              replaceVariables(item.value ?? "", variables),
            )}`,
        )
        .join("&")
    : "";

  const built = `${protocol}://${replaceVariables(host, variables)}${path ? `/${path}` : ""}`;
  return ensureAbsoluteUrl(query ? `${built}?${query}` : built);
}

function collectPostmanItems(items, variables, requests) {
  if (!Array.isArray(items)) return;

  for (const item of items) {
    if (Array.isArray(item?.item)) {
      collectPostmanItems(item.item, variables, requests);
      continue;
    }

    const request = item?.request;
    if (!request) continue;

    const method = String(request.method || "GET").toUpperCase();
    if (!VALID_METHODS.has(method)) continue;
    if (!INCLUDE_WRITE && !SAFE_METHODS.has(method)) continue;

    const url = extractPostmanUrl(request.url, variables);
    if (!url) continue;

    const headers = {};
    if (Array.isArray(request.header)) {
      for (const header of request.header) {
        if (!header?.key || header.disabled) continue;
        headers[header.key] = replaceVariables(header.value ?? "", variables);
      }
    }
    if (AUTH_TOKEN && !headers.Authorization) {
      headers.Authorization = `Bearer ${AUTH_TOKEN}`;
    }

    let body = null;
    const bodyMode = request?.body?.mode;
    if (bodyMode === "raw") {
      body = replaceVariables(request.body.raw || "", variables);
    } else if (bodyMode === "urlencoded" && Array.isArray(request.body.urlencoded)) {
      body = request.body.urlencoded
        .filter((entry) => entry?.key)
        .map(
          (entry) =>
            `${encodeURIComponent(entry.key)}=${encodeURIComponent(
              replaceVariables(entry.value ?? "", variables),
            )}`,
        )
        .join("&");
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
    } else if (bodyMode === "formdata" && Array.isArray(request.body.formdata)) {
      const payload = {};
      for (const entry of request.body.formdata) {
        if (!entry?.key || entry.disabled) continue;
        payload[entry.key] = replaceVariables(entry.value ?? "", variables);
      }
      body = JSON.stringify(payload);
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }

    requests.push({
      source: "postman",
      name: item?.name || `${method} ${url}`,
      method,
      url,
      headers,
      body,
    });
  }
}

function extractPostmanRequests(doc, variables) {
  const requests = [];
  collectPostmanItems(doc?.item || [], variables, requests);
  return requests;
}

function sampleFromSchema(schema) {
  if (!schema || typeof schema !== "object") return "";

  if (schema.example !== undefined) return schema.example;
  if (Array.isArray(schema.examples) && schema.examples.length > 0) return schema.examples[0];
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return schema.enum[0];

  switch (schema.type) {
    case "integer":
    case "number":
      return 1;
    case "boolean":
      return true;
    case "array":
      return [sampleFromSchema(schema.items)];
    case "object": {
      const result = {};
      for (const [key, value] of Object.entries(schema.properties || {})) {
        result[key] = sampleFromSchema(value);
      }
      return result;
    }
    default:
      return "sample";
  }
}

function extractOpenApiBody(operation) {
  if (!operation?.requestBody?.content) return null;

  const jsonBody = operation.requestBody.content["application/json"];
  if (jsonBody) {
    if (jsonBody.example !== undefined) return JSON.stringify(jsonBody.example);
    if (jsonBody.examples) {
      const firstExample = Object.values(jsonBody.examples)[0];
      if (firstExample?.value !== undefined) {
        return JSON.stringify(firstExample.value);
      }
    }
    if (jsonBody.schema) {
      return JSON.stringify(sampleFromSchema(jsonBody.schema));
    }
  }

  const formBody = operation.requestBody.content["application/x-www-form-urlencoded"];
  if (formBody?.schema?.properties) {
    const pairs = [];
    for (const [key, value] of Object.entries(formBody.schema.properties)) {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(sampleFromSchema(value))}`);
    }
    return pairs.join("&");
  }

  return null;
}

function extractOpenApiRequests(doc, variables) {
  const requests = [];
  const serverUrl = ensureAbsoluteUrl(
    replaceVariables(doc?.servers?.[0]?.url || BASE_URL, variables).replace(/\/+$/, ""),
  );
  const paths = doc?.paths || {};

  for (const [routePath, methods] of Object.entries(paths)) {
    const sharedParameters = Array.isArray(methods?.parameters) ? methods.parameters : [];

    for (const [methodName, operation] of Object.entries(methods || {})) {
      const method = String(methodName || "").toUpperCase();
      if (!VALID_METHODS.has(method)) continue;
      if (!INCLUDE_WRITE && !SAFE_METHODS.has(method)) continue;

      const operationParameters = Array.isArray(operation?.parameters) ? operation.parameters : [];
      const parameters = [...sharedParameters, ...operationParameters];
      const pathValue = routePath.replace(/{[^}]+}/g, "1");

      const queryPairs = [];
      for (const parameter of parameters) {
        if (!parameter || parameter.in !== "query" || !parameter.name) continue;
        const sample = sampleFromSchema(parameter.schema || {});
        queryPairs.push(`${encodeURIComponent(parameter.name)}=${encodeURIComponent(sample)}`);
      }

      const query = queryPairs.length > 0 ? `?${queryPairs.join("&")}` : "";
      const url = `${serverUrl}${pathValue}${query}`;

      const headers = {};
      if (AUTH_TOKEN) {
        headers.Authorization = `Bearer ${AUTH_TOKEN}`;
      }

      let body = null;
      if (!SAFE_METHODS.has(method)) {
        body = extractOpenApiBody(operation);
      }

      if (body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      requests.push({
        source: "openapi",
        name: operation?.operationId || operation?.summary || `${method} ${pathValue}`,
        method,
        url,
        headers,
        body,
      });
    }
  }

  return requests;
}

function dedupeRequests(requests) {
  const seen = new Set();
  const unique = [];

  for (const request of requests) {
    const key = `${request.method} ${request.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(request);
  }

  return unique;
}

function toCsvLine(parts) {
  return parts
    .map((part) => {
      const value = String(part ?? "");
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replaceAll('"', '""')}"`;
      }
      return value;
    })
    .join(",");
}

export default function () {
  const request = finalRequests[(__VU + __ITER) % finalRequests.length];
  const params = {
    headers: request.headers || {},
    timeout: REQUEST_TIMEOUT,
    tags: {
      request_name: request.name,
      request_method: request.method,
      request_source: request.source,
    },
  };

  const response = http.request(request.method, request.url, request.body, params);
  throughputCounter.add(1);
  responseTimeTrend.add(response.timings.duration);

  const success = check(response, {
    "status is 2xx/3xx/4xx": (res) => Number(res.status) >= 200 && Number(res.status) < 500,
  });

  apiErrorRate.add(!success || Boolean(response.error));
  sleep(THINK_TIME_SECONDS);
}

export function handleSummary(data) {
  const jsonOutput = {
    generatedAt: new Date().toISOString(),
    config: {
      collectionFile: COLLECTION_FILE,
      baseUrl: BASE_URL,
      targetUsers: TARGET_USERS,
      batchUsers: BATCH_USERS,
      stages,
      includeWriteMethods: INCLUDE_WRITE,
      extractedEndpoints: finalRequests.length,
    },
    metrics: data.metrics,
    rootGroup: data.root_group,
  };

  const csvRows = [
    toCsvLine(["metric", "type", "count", "rate", "avg", "min", "med", "p90", "p95", "p99", "max"]),
  ];

  for (const [metricName, metric] of Object.entries(data.metrics || {})) {
    const values = metric.values || {};
    csvRows.push(
      toCsvLine([
        metricName,
        metric.type || "",
        values.count ?? "",
        values.rate ?? "",
        values.avg ?? "",
        values.min ?? "",
        values.med ?? "",
        values["p(90)"] ?? "",
        values["p(95)"] ?? "",
        values["p(99)"] ?? "",
        values.max ?? "",
      ]),
    );
  }

  return {
    [`${OUT_PREFIX}.json`]: JSON.stringify(jsonOutput, null, 2),
    [`${OUT_PREFIX}.csv`]: `${csvRows.join("\n")}\n`,
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
