export const measureRequests = async (requests, thresholdMs = 500) => {
  const start = Date.now();
  const results = await Promise.all(requests);
  const elapsed = Date.now() - start;
  if (elapsed > thresholdMs) {
    throw new Error(`Performance threshold exceeded: ${elapsed}ms > ${thresholdMs}ms`);
  }
  return { elapsed, count: results.length };
};

export const concurrent = async (fn, times = 10) => {
  const tasks = Array.from({ length: times }, () => fn());
  return Promise.all(tasks);
};
