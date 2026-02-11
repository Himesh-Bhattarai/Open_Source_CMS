import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";
import { errorHandler } from "../../Utils/Logger/errorHandler.js";

const loadExternalRequestApp = async ({ rateImpl, extractImpl, oneRoutesImpl }) => {
  jest.resetModules();

  jest.unstable_mockModule("../../Validation/middleware/rateLimiter.js", () => ({
    rateLimiter: rateImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/extractDomain.js", () => ({
    extractDomain: extractImpl,
  }));
  jest.unstable_mockModule("../../Routes/Api/oneRoutes.js", () => ({
    default: oneRoutesImpl,
  }));

  const { rateLimiter } = await import("../../Validation/middleware/rateLimiter.js");
  const { extractDomain } = await import("../../Validation/middleware/extractDomain.js");
  const { default: oneRoutes } = await import("../../Routes/Api/oneRoutes.js");

  const app = express();
  app.use(express.json());
  app.use("/api/v1/external-request", rateLimiter, extractDomain, oneRoutes);
  app.use(errorHandler);
  return app;
};

describe("External request middleware chain", () => {
  test("valid invalid edge chain behavior", async () => {
    const oneRoutes = express.Router().get("/blog", (req, res) => {
      res.status(200).json({ domain: req.domain, ok: true });
    });

    const passRate = (req, res, next) => next();
    const passExtract = (req, res, next) => {
      req.domain = "example";
      req.url = req.url.replace("/example", "");
      next();
    };

    const app = await loadExternalRequestApp({
      rateImpl: passRate,
      extractImpl: passExtract,
      oneRoutesImpl: oneRoutes,
    });

    const valid = await request(app).get("/api/v1/external-request/example/blog");
    expect(valid.status).toBe(200);

    const invalidApp = await loadExternalRequestApp({
      rateImpl: passRate,
      extractImpl: (req, res) => res.status(400).json({ error: "Invalid URL. Must include domain." }),
      oneRoutesImpl: oneRoutes,
    });
    const invalid = await request(invalidApp).get("/api/v1/external-request/");
    expect(invalid.status).toBe(400);

    const edgeApp = await loadExternalRequestApp({
      rateImpl: (req, res) => res.status(429).json({ error: "Rate limit exceeded" }),
      extractImpl: passExtract,
      oneRoutesImpl: oneRoutes,
    });
    const edge = await request(edgeApp).get("/api/v1/external-request/example/blog");
    expect(edge.status).toBe(429);
  });
});
