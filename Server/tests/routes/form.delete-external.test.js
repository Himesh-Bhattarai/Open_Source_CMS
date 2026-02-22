import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadFormDeleteRouter = async (formModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Form/Form.js", () => ({ Form: formModel }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({
    cmsEventService: { deleteForm: jest.fn() },
  }));
  return (await import("../../Routes/Delete/formDelete.js")).default;
};

const loadExternalFormRouter = async ({ getFormImpl, tenantImpl, apiKeyImpl, trackImpl }) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Api/getForms.js", () => ({ getForm: getFormImpl }));
  jest.unstable_mockModule("../../Validation/middleware/tenantVerification.js", () => ({
    tenantVerification: tenantImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/apiKeyVerification.js", () => ({
    apiKeyVerification: apiKeyImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/trackIntegrationUsage.js", () => ({
    trackIntegrationUsage: () => trackImpl,
  }));
  return (await import("../../Routes/Api/getForm.js")).default;
};

describe("Form delete/external routes", () => {
  test("DELETE form valid invalid edge", async () => {
    const router = await loadFormDeleteRouter({
      findById: jest
        .fn()
        .mockResolvedValue({ _id: "f1", formName: "Contact", websiteId: "w1", userId: "user-1" }),
      findByIdAndDelete: jest.fn().mockResolvedValue({ _id: "f1" }),
    });
    const app = createRouteTestApp("/delete", router);

    const valid = await request(app).delete("/delete/form/f1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).delete("/delete/form/f1");
    expect(invalid.status).toBe(401);

    const edge = await request(app).get("/delete/form/f1");
    expect(edge.status).toBe(404);
  });

  test("External form route valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalFormRouter({
      getFormImpl: (req, res) => res.status(200).json({ form: {} }),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const app = createRouteTestApp("/ext/form", router);

    const valid = await request(app).get("/ext/form/");
    expect(valid.status).toBe(200);

    const invalidRouter = await loadExternalFormRouter({
      getFormImpl: (req, res) => res.status(200).json({ form: {} }),
      tenantImpl: pass,
      apiKeyImpl: (req, res) => res.status(403).json({ error: "Invalid API key" }),
      trackImpl: (req, res, next) => next(),
    });
    const invalidApp = createRouteTestApp("/ext/form", invalidRouter);
    const invalid = await request(invalidApp).get("/ext/form/");
    expect(invalid.status).toBe(403);

    const edgeRouter = await loadExternalFormRouter({
      getFormImpl: (req, res, next) => next(new Error("form external fail")),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const edgeApp = createRouteTestApp("/ext/form", edgeRouter);
    const edge = await request(edgeApp).get("/ext/form/");
    expect(edge.status).toBe(500);
  });
});
