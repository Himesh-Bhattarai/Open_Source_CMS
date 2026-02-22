import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";

const loadExternalThemeRouter = async ({ getThemeImpl, tenantImpl, apiKeyImpl, trackImpl }) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Api/getTheme.js", () => ({ getTheme: getThemeImpl }));
  jest.unstable_mockModule("../../Validation/middleware/tenantVerification.js", () => ({
    tenantVerification: tenantImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/apiKeyVerification.js", () => ({
    apiKeyVerification: apiKeyImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/trackIntegrationUsage.js", () => ({
    trackIntegrationUsage: () => trackImpl,
  }));
  return (await import("../../Routes/Api/getTheme.js")).default;
};

const loadExternalMediaRouter = async ({ getMediaImpl, tenantImpl, apiKeyImpl, trackImpl }) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Api/getMedia.js", () => ({ getMedia: getMediaImpl }));
  jest.unstable_mockModule("../../Validation/middleware/tenantVerification.js", () => ({
    tenantVerification: tenantImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/apiKeyVerification.js", () => ({
    apiKeyVerification: apiKeyImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/trackIntegrationUsage.js", () => ({
    trackIntegrationUsage: () => trackImpl,
  }));
  return (await import("../../Routes/Api/getMedia.js")).default;
};

const loadOneRoutes = async () => {
  jest.resetModules();
  const route = (name) =>
    express.Router().get("/", (req, res) => res.status(200).json({ route: name }));
  jest.unstable_mockModule("../../Routes/Api/getBlog.js", () => ({ default: route("blog") }));
  jest.unstable_mockModule("../../Routes/Api/getPages.js", () => ({ default: route("pages") }));
  jest.unstable_mockModule("../../Routes/Api/getMenu.js", () => ({ default: route("menu") }));
  jest.unstable_mockModule("../../Routes/Api/getFooter.js", () => ({ default: route("footer") }));
  jest.unstable_mockModule("../../Routes/Api/getSeo.js", () => ({ default: route("seo") }));
  jest.unstable_mockModule("../../Routes/Api/getTheme.js", () => ({ default: route("theme") }));
  jest.unstable_mockModule("../../Routes/Api/getMedia.js", () => ({ default: route("media") }));
  jest.unstable_mockModule("../../Routes/Api/getForm.js", () => ({ default: route("form") }));
  return (await import("../../Routes/Api/oneRoutes.js")).default;
};

describe("External API routes", () => {
  test("External theme valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalThemeRouter({
      getThemeImpl: (req, res) => res.status(200).json({ theme: {} }),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const app = createRouteTestApp("/ext/theme", router);

    expect((await request(app).get("/ext/theme/")).status).toBe(200);

    const invalidRouter = await loadExternalThemeRouter({
      getThemeImpl: (req, res) => res.status(200).json({ theme: {} }),
      tenantImpl: pass,
      apiKeyImpl: (req, res) => res.status(403).json({ error: "Invalid API key" }),
      trackImpl: (req, res, next) => next(),
    });
    const invalidApp = createRouteTestApp("/ext/theme", invalidRouter);
    expect((await request(invalidApp).get("/ext/theme/")).status).toBe(403);

    const edgeRouter = await loadExternalThemeRouter({
      getThemeImpl: (req, res, next) => next(new Error("theme ext fail")),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const edgeApp = createRouteTestApp("/ext/theme", edgeRouter);
    expect((await request(edgeApp).get("/ext/theme/")).status).toBe(500);
  });

  test("External media valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalMediaRouter({
      getMediaImpl: (req, res) => res.status(200).json({ media: {} }),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const app = createRouteTestApp("/ext/media", router);

    expect((await request(app).get("/ext/media/")).status).toBe(200);

    const invalidRouter = await loadExternalMediaRouter({
      getMediaImpl: (req, res) => res.status(200).json({ media: {} }),
      tenantImpl: pass,
      apiKeyImpl: (req, res) => res.status(403).json({ error: "Invalid API key" }),
      trackImpl: (req, res, next) => next(),
    });
    const invalidApp = createRouteTestApp("/ext/media", invalidRouter);
    expect((await request(invalidApp).get("/ext/media/")).status).toBe(403);

    const edgeRouter = await loadExternalMediaRouter({
      getMediaImpl: (req, res, next) => next(new Error("media ext fail")),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const edgeApp = createRouteTestApp("/ext/media", edgeRouter);
    expect((await request(edgeApp).get("/ext/media/")).status).toBe(500);
  });

  test("oneRoutes wiring valid invalid edge", async () => {
    const router = await loadOneRoutes();
    const app = createRouteTestApp("/one", router);

    expect((await request(app).get("/one/blog")).body.route).toBe("blog");
    expect((await request(app).get("/one/unknown")).status).toBe(404);

    jest.resetModules();
    jest.unstable_mockModule("../../Routes/Api/getBlog.js", () => ({
      default: express.Router().get("/", (req, res, next) => next(new Error("blog route fail"))),
    }));
    jest.unstable_mockModule("../../Routes/Api/getPages.js", () => ({
      default: express.Router().get("/", (req, res) => res.status(200).json({ ok: true })),
    }));
    jest.unstable_mockModule("../../Routes/Api/getMenu.js", () => ({
      default: express.Router().get("/", (req, res) => res.status(200).json({ ok: true })),
    }));
    jest.unstable_mockModule("../../Routes/Api/getFooter.js", () => ({
      default: express.Router().get("/", (req, res) => res.status(200).json({ ok: true })),
    }));
    jest.unstable_mockModule("../../Routes/Api/getSeo.js", () => ({
      default: express.Router().get("/", (req, res) => res.status(200).json({ ok: true })),
    }));
    jest.unstable_mockModule("../../Routes/Api/getTheme.js", () => ({
      default: express.Router().get("/", (req, res) => res.status(200).json({ ok: true })),
    }));
    jest.unstable_mockModule("../../Routes/Api/getMedia.js", () => ({
      default: express.Router().get("/", (req, res) => res.status(200).json({ ok: true })),
    }));
    jest.unstable_mockModule("../../Routes/Api/getForm.js", () => ({
      default: express.Router().get("/", (req, res) => res.status(200).json({ ok: true })),
    }));

    const edgeRouter = (await import("../../Routes/Api/oneRoutes.js")).default;
    const edgeApp = createRouteTestApp("/one", edgeRouter);
    expect((await request(edgeApp).get("/one/blog")).status).toBe(500);
  });
});
