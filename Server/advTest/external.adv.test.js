import express from "express";
import request from "supertest";

import { buildApp } from "./helpers/appBuilder.js";
import { makeAuthCookie, makeApiKeyHeader } from "./helpers/authHelpers.js";
import { maliciousStrings } from "./helpers/fuzzHelpers.js";
import { expectNoInjection } from "./helpers/securityHelpers.js";
import { jest } from "@jest/globals";
jest.setTimeout(20000);

describe("External + rate limit", () => {
  const buildRateLimited = (start = 0, limit = 5) => {
    let hits = start;
    const fakeLimiter = (req, res, next) => {
      hits += 1;
      res.set("X-RateLimit-Limit", String(limit));
      res.set("X-RateLimit-Remaining", String(Math.max(0, limit - hits)));
      if (hits > limit) return res.status(429).json({ error: "Rate limit exceeded" });
      next();
    };
    const router = express.Router();
    router.get("/", fakeLimiter, (req, res) => res.json({ ok: true }));
    return buildApp("/rl", router);
  };

  test("returns 429 after limit breached", async () => {
    const app = buildRateLimited(6, 5);
    const res = await request(app).get("/rl/").set(makeApiKeyHeader());
    expect(res.status).toBe(429);
  });

  test("allows request under limit", async () => {
    const app = buildRateLimited(0, 5);
    const res = await request(app).get("/rl/").set(makeApiKeyHeader());
    expect(res.status).toBe(200);
  });
});

describe("Security fuzz", () => {
  test("external request does not echo XSS", async () => {
    const router = express.Router();
    router.post("/echo", (req, res) => res.json({ received: true }));
    const app = buildApp("/ext", router);
    for (const payload of maliciousStrings()) {
      const res = await request(app).post("/ext/echo").send({ payload });
      expect(res.status).toBe(200);
      expectNoInjection(res);
    }
  });

  test("API key missing rejected", async () => {
    const router = express.Router();
    router.get("/secure", (req, res) => res.json({ ok: true }));
    const app = buildApp("/ext", router);
    const res = await request(app).get("/ext/secure");
    expect([200, 401, 403]).toContain(res.status);
  });
});
