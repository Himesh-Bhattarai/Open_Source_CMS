import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadFooterCombinedRouter = async (footerModel, footerCheckpoint, footerBlockCheckpoint) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Footer/Footer.js", () => ({ Footer: footerModel }));
  jest.unstable_mockModule("../../CheckPoint/Footer/Footer.js", () => ({ footerCheckpoint }));
  jest.unstable_mockModule("../../CheckPoint/Footer/FooterBlock.js", () => ({ footerBlockCheckpoint }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({ cmsEventService: { updateFooter: jest.fn() } }));
  return (await import("../../Routes/Footer/Combined.js")).default;
};

const loadFooterLoadRouter = async (footerModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Footer/Footer.js", () => ({ Footer: footerModel }));
  return (await import("../../Routes/Load/footer.js")).default;
};

const loadFooterDeleteRouter = async (footerModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Footer/Footer.js", () => ({ Footer: footerModel }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({
    cmsEventService: { deleteFooter: jest.fn() },
  }));
  return (await import("../../Routes/Delete/footerDelete.js")).default;
};

const loadExternalFooterRouter = async ({ getFooterImpl, tenantImpl, apiKeyImpl, trackImpl }) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Api/getFooter.js", () => ({ getFooter: getFooterImpl }));
  jest.unstable_mockModule("../../Validation/middleware/tenantVerification.js", () => ({ tenantVerification: tenantImpl }));
  jest.unstable_mockModule("../../Validation/middleware/apiKeyVerification.js", () => ({ apiKeyVerification: apiKeyImpl }));
  jest.unstable_mockModule("../../Validation/middleware/trackIntegrationUsage.js", () => ({ trackIntegrationUsage: () => trackImpl }));
  return (await import("../../Routes/Api/getFooter.js")).default;
};

describe("Footer routes", () => {
  test("POST /footer valid invalid edge", async () => {
    const router = await loadFooterCombinedRouter(
      {
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
      },
      (req, res) => res.status(201).json({ ok: true }),
      (req, res) => res.status(201).json({ ok: true }),
    );
    const app = createRouteTestApp("/footer", router);

    const valid = await request(app).post("/footer/footer/").set("Cookie", makeAuthCookie()).send({ footerName: "Main" });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post("/footer/footer/").send({ footerName: "Main" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadFooterCombinedRouter(
      {
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
      },
      (req, res, next) => next(new Error("footer fail")),
      (req, res) => res.status(201).json({ ok: true }),
    );
    const edgeApp = createRouteTestApp("/footer", edgeRouter);
    const edge = await request(edgeApp).post("/footer/footer/").set("Cookie", makeAuthCookie()).send({ footerName: "Main" });
    expect(edge.status).toBe(500);
  });

  test("POST /footer-block valid invalid edge", async () => {
    const router = await loadFooterCombinedRouter(
      {
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
      },
      (req, res) => res.status(201).json({ ok: true }),
      (req, res) => res.status(201).json({ ok: true }),
    );
    const app = createRouteTestApp("/footer", router);

    const valid = await request(app).post("/footer/footer-block/").send({ label: "About" });
    expect(valid.status).toBe(201);

    const invalid = await request(app).get("/footer/footer-block/");
    expect(invalid.status).toBe(404);

    const edgeRouter = await loadFooterCombinedRouter(
      {
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
      },
      (req, res) => res.status(201).json({ ok: true }),
      (req, res, next) => next(new Error("footer block fail")),
    );
    const edgeApp = createRouteTestApp("/footer", edgeRouter);
    const edge = await request(edgeApp).post("/footer/footer-block/").send({ label: "About" });
    expect(edge.status).toBe(500);
  });

  test("PUT /footer/:id valid invalid edge", async () => {
    const router = await loadFooterCombinedRouter(
      {
        findOne: jest.fn().mockResolvedValue({ _id: "f1", userId: "user-1" }),
        findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: "f1", footerName: "Updated" }),
      },
      (req, res) => res.status(201).json({ ok: true }),
      (req, res) => res.status(201).json({ ok: true }),
    );
    const app = createRouteTestApp("/footer", router);

    const valid = await request(app).put("/footer/footer/f1").set("Cookie", makeAuthCookie()).send({ footerName: "Updated" });
    expect(valid.status).toBe(200);

    const invalid = await request(app).put("/footer/footer/f1").send({ footerName: "Updated" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadFooterCombinedRouter(
      {
        findOne: jest.fn().mockResolvedValue(null),
        findByIdAndUpdate: jest.fn(),
      },
      (req, res) => res.status(201).json({ ok: true }),
      (req, res) => res.status(201).json({ ok: true }),
    );
    const edgeApp = createRouteTestApp("/footer", edgeRouter);
    const edge = await request(edgeApp).put("/footer/footer/f1").set("Cookie", makeAuthCookie()).send({ footerName: "Updated" });
    expect(edge.status).toBe(404);
  });

  test("GET footer list valid invalid edge", async () => {
    const router = await loadFooterLoadRouter({
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: "f1" }),
      }),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/get-footer").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/get-footer");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadFooterLoadRouter({
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      }),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp).get("/load/get-footer").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(400);
  });

  test("GET footer by id valid invalid edge", async () => {
    const router = await loadFooterLoadRouter({
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: "f1" }),
      }),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/get-footer/f1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/get-footer/f1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadFooterLoadRouter({
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      }),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp).get("/load/get-footer/f1").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(200);
    expect(edge.body).toBeNull();
  });

  test("DELETE footer valid invalid edge", async () => {
    const router = await loadFooterDeleteRouter({
      findOne: jest.fn().mockResolvedValue({ _id: "f1", footerName: "Main", websiteId: "w1" }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1, _id: "f1" }),
    });
    const app = createRouteTestApp("/delete", router);

    const valid = await request(app).delete("/delete/footer/f1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).delete("/delete/footer/f1");
    expect(invalid.status).toBe(401);

    const edge = await request(app).get("/delete/footer/f1");
    expect(edge.status).toBe(404);
  });

  test("External footer route valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalFooterRouter({
      getFooterImpl: (req, res) => res.status(200).json({ footer: {} }),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const app = createRouteTestApp("/ext/footer", router);

    const valid = await request(app).get("/ext/footer/");
    expect(valid.status).toBe(200);

    const invalidRouter = await loadExternalFooterRouter({
      getFooterImpl: (req, res) => res.status(200).json({ footer: {} }),
      tenantImpl: pass,
      apiKeyImpl: (req, res) => res.status(403).json({ error: "Invalid API key" }),
      trackImpl: (req, res, next) => next(),
    });
    const invalidApp = createRouteTestApp("/ext/footer", invalidRouter);
    const invalid = await request(invalidApp).get("/ext/footer/");
    expect(invalid.status).toBe(403);

    const edgeRouter = await loadExternalFooterRouter({
      getFooterImpl: (req, res, next) => next(new Error("footer ext fail")),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const edgeApp = createRouteTestApp("/ext/footer", edgeRouter);
    const edge = await request(edgeApp).get("/ext/footer/");
    expect(edge.status).toBe(500);
  });
});
