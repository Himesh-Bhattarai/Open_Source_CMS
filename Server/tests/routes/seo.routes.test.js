import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadSeoRouter = async (seoCheckpointImpl, updateSeoCheckpointImpl) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Seo/Seo.js", () => ({
    seoCheckpoint: seoCheckpointImpl,
  }));
  jest.unstable_mockModule("../../CheckPoint/Seo/updateSeo.js", () => ({
    updateSeoCheckpoint: updateSeoCheckpointImpl,
  }));
  return (await import("../../Routes/Seo/Seo.js")).default;
};

const loadSeoLoadRouter = async (seoModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Seo/Seo.js", () => ({ Seo: seoModel }));
  return (await import("../../Routes/Load/Seo.js")).default;
};

const loadSeoDeleteRouter = async (seoModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Seo/Seo.js", () => ({ Seo: seoModel }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({
    cmsEventService: { deleteSEO: jest.fn() },
  }));
  return (await import("../../Routes/Delete/seoDelete.js")).default;
};

const loadExternalSeoRouter = async ({ getSeoImpl, tenantImpl, apiKeyImpl, trackImpl }) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Api/getSeo.js", () => ({ getSeo: getSeoImpl }));
  jest.unstable_mockModule("../../Validation/middleware/tenantVerification.js", () => ({
    tenantVerification: tenantImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/apiKeyVerification.js", () => ({
    apiKeyVerification: apiKeyImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/trackIntegrationUsage.js", () => ({
    trackIntegrationUsage: () => trackImpl,
  }));
  return (await import("../../Routes/Api/getSeo.js")).default;
};

describe("SEO routes", () => {
  test("POST seo valid invalid edge", async () => {
    const router = await loadSeoRouter(
      (req, res) => res.status(201).json({ ok: true }),
      (req, res) => res.status(200).json({ ok: true }),
    );
    const app = createRouteTestApp("/seo", router);

    const valid = await request(app)
      .post("/seo/seo")
      .set("Cookie", makeAuthCookie())
      .send({ title: "SEO" });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post("/seo/seo").send({ title: "SEO" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadSeoRouter(
      (req, res, next) => next(new Error("seo fail")),
      (req, res) => res.status(200).json({ ok: true }),
    );
    const edgeApp = createRouteTestApp("/seo", edgeRouter);
    const edge = await request(edgeApp)
      .post("/seo/seo")
      .set("Cookie", makeAuthCookie())
      .send({ title: "SEO" });
    expect(edge.status).toBe(500);
  });

  test("PUT seo valid invalid edge", async () => {
    const router = await loadSeoRouter(
      (req, res) => res.status(201).json({ ok: true }),
      (req, res) => res.status(200).json({ ok: true }),
    );
    const app = createRouteTestApp("/seo", router);

    const valid = await request(app)
      .put("/seo/seo/s1")
      .set("Cookie", makeAuthCookie())
      .send({ title: "SEO2" });
    expect(valid.status).toBe(200);

    const invalid = await request(app).put("/seo/seo/s1").send({ title: "SEO2" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadSeoRouter(
      (req, res) => res.status(201).json({ ok: true }),
      (req, res, next) => next(new Error("update seo fail")),
    );
    const edgeApp = createRouteTestApp("/seo", edgeRouter);
    const edge = await request(edgeApp)
      .put("/seo/seo/s1")
      .set("Cookie", makeAuthCookie())
      .send({ title: "SEO2" });
    expect(edge.status).toBe(500);
  });

  test("GET seo list valid invalid edge", async () => {
    const router = await loadSeoLoadRouter({
      find: jest.fn().mockResolvedValue([{ _id: "s1" }]),
      findOne: jest.fn().mockResolvedValue({ _id: "s1" }),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/get-seo-settings").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/get-seo-settings");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadSeoLoadRouter({
      find: jest.fn().mockRejectedValue(new Error("db fail")),
      findOne: jest.fn(),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp)
      .get("/load/get-seo-settings")
      .set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("GET seo by id valid invalid edge", async () => {
    const router = await loadSeoLoadRouter({
      find: jest.fn(),
      findOne: jest.fn().mockResolvedValue({ _id: "s1" }),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app)
      .get("/load/get-seo-settings/s1")
      .set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/get-seo-settings/s1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadSeoLoadRouter({
      find: jest.fn(),
      findOne: jest.fn().mockResolvedValue(null),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp)
      .get("/load/get-seo-settings/s1")
      .set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("DELETE seo valid invalid edge", async () => {
    const router = await loadSeoDeleteRouter({
      findById: jest
        .fn()
        .mockResolvedValue({ _id: "s1", userId: "user-1", seoName: "SEO", websiteId: "w1" }),
      findByIdAndDelete: jest.fn().mockResolvedValue({ _id: "s1" }),
    });
    const app = createRouteTestApp("/delete", router);

    const valid = await request(app).delete("/delete/seo/s1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).delete("/delete/seo/s1");
    expect(invalid.status).toBe(401);

    const edge = await request(app).get("/delete/seo/s1");
    expect(edge.status).toBe(404);
  });

  test("External seo route valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalSeoRouter({
      getSeoImpl: (req, res) => res.status(200).json({ getSeo: {} }),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const app = createRouteTestApp("/ext/seo", router);

    const valid = await request(app).get("/ext/seo/");
    expect(valid.status).toBe(200);

    const invalidRouter = await loadExternalSeoRouter({
      getSeoImpl: (req, res) => res.status(200).json({ getSeo: {} }),
      tenantImpl: pass,
      apiKeyImpl: (req, res) => res.status(403).json({ error: "Invalid API key" }),
      trackImpl: (req, res, next) => next(),
    });
    const invalidApp = createRouteTestApp("/ext/seo", invalidRouter);
    const invalid = await request(invalidApp).get("/ext/seo/");
    expect(invalid.status).toBe(403);

    const edgeRouter = await loadExternalSeoRouter({
      getSeoImpl: (req, res, next) => next(new Error("seo ext fail")),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const edgeApp = createRouteTestApp("/ext/seo", edgeRouter);
    const edge = await request(edgeApp).get("/ext/seo/");
    expect(edge.status).toBe(500);
  });
});
