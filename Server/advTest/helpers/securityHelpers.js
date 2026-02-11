import { maliciousStrings } from "./fuzzHelpers.js";

export const injectHeaders = {
  "X-Forwarded-For": "127.0.0.1; DROP TABLE",
  "X-Real-IP": "::1",
};

export const securityPayloads = () => maliciousStrings().map((s) => ({ payload: s }));

export const expectNoInjection = (res) => {
  if (typeof res.text === "string" && maliciousStrings().some((m) => res.text.includes(m))) {
    throw new Error("Response reflected malicious input");
  }
};
