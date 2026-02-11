import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadMenuCreateRouter = async (handler) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Menu/Menu.js", () => ({ menuCheckpoint: handler }));
  return (await import("../../Routes/Menu/Menu.js")).default;
};

const loadMenuUpdateRouter = async (handler) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Menu/UpdateMenu.js", () => ({ updateMenuCheckpoint: handler }));
  return (await import("../../Routes/Menu/UpdateMenu.js")).default;
};

const loadMenuLoadRouter = async (menuModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Menu/Menu.js", () => ({ Menu: menuModel }));
  return (await import("../../Routes/Load/menu.js")).default;
};

const loadMenuDeleteRouter = async (menuModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Menu/Menu.js", () => ({ Menu: menuModel }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({
    cmsEventService: { deleteMenu: jest.fn() },
  }));
  return (await import("../../Routes/Delete/menuDelete.js")).default;
};

const loadExternalMenuRouter = async ({ getMenuImpl, tenantImpl, apiKeyImpl, trackImpl }) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Api/getMenu.js", () => ({ getMenu: getMenuImpl }));
  jest.unstable_mockModule("../../Validation/middleware/tenantVerification.js", () => ({ tenantVerification: tenantImpl }));
  jest.unstable_mockModule("../../Validation/middleware/apiKeyVerification.js", () => ({ apiKeyVerification: apiKeyImpl }));
  jest.unstable_mockModule("../../Validation/middleware/trackIntegrationUsage.js", () => ({ trackIntegrationUsage: () => trackImpl }));
  return (await import("../../Routes/Api/getMenu.js")).default;
};

describe("Menu routes", () => {
  test("POST menu create valid invalid edge", async () => {
    const router = await loadMenuCreateRouter((req, res) => res.status(201).json({ ok: true }));
    const app = createRouteTestApp("/menu", router);

    const valid = await request(app)
      .post("/menu/")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Main Menu", menuLocation: "header", status: "draft" });
    expect(valid.status).toBe(201);

    const invalid = await request(app)
      .post("/menu/")
      .set("Cookie", makeAuthCookie())
      .send({ title: "x" });
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadMenuCreateRouter((req, res, next) => next(new Error("menu fail")));
    const edgeApp = createRouteTestApp("/menu", edgeRouter);
    const edge = await request(edgeApp)
      .post("/menu/")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Main Menu", menuLocation: "header", status: "draft" });
    expect(edge.status).toBe(500);
  });

  test("PUT menu update valid invalid edge", async () => {
    const router = await loadMenuUpdateRouter((req, res) => res.status(200).json({ ok: true }));
    const app = createRouteTestApp("/menus", router);

    const valid = await request(app).put("/menus/m1").set("Cookie", makeAuthCookie()).send({ title: "Updated" });
    expect(valid.status).toBe(200);

    const invalid = await request(app).put("/menus/m1").send({ title: "Updated" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadMenuUpdateRouter((req, res, next) => next(new Error("update menu fail")));
    const edgeApp = createRouteTestApp("/menus", edgeRouter);
    const edge = await request(edgeApp).put("/menus/m1").set("Cookie", makeAuthCookie()).send({ title: "Updated" });
    expect(edge.status).toBe(500);
  });

  test("GET menus list valid invalid edge", async () => {
    const router = await loadMenuLoadRouter({
      find: jest.fn().mockResolvedValue([{ _id: "m1" }]),
      findOne: jest.fn().mockResolvedValue({ _id: "m1" }),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/menus").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/menus");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadMenuLoadRouter({
      find: jest.fn().mockRejectedValue(new Error("db fail")),
      findOne: jest.fn(),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp).get("/load/menus").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("GET menu by id valid invalid edge", async () => {
    const router = await loadMenuLoadRouter({
      find: jest.fn(),
      findOne: jest.fn().mockResolvedValue({ _id: "m1" }),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/menu/m1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/menu/m1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadMenuLoadRouter({
      find: jest.fn(),
      findOne: jest.fn().mockResolvedValue(null),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp).get("/load/menu/m1").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("DELETE menu valid invalid edge", async () => {
    const router = await loadMenuDeleteRouter({
      findOneAndDelete: jest.fn().mockResolvedValue({ _id: "m1", menuName: "Main", websiteId: "w1" }),
    });
    const app = createRouteTestApp("/delete", router);

    const valid = await request(app).delete("/delete/menu/m1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).delete("/delete/menu/m1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadMenuDeleteRouter({
      findOneAndDelete: jest.fn().mockResolvedValue(null),
    });
    const edgeApp = createRouteTestApp("/delete", edgeRouter);
    const edge = await request(edgeApp).delete("/delete/menu/m1").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(404);
  });

  test("External menu route valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalMenuRouter({
      getMenuImpl: (req, res) => res.status(200).json({ getMenu: [] }),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const app = createRouteTestApp("/ext/menu", router);

    const valid = await request(app).get("/ext/menu/");
    expect(valid.status).toBe(200);

    const invalidRouter = await loadExternalMenuRouter({
      getMenuImpl: (req, res) => res.status(200).json({ getMenu: [] }),
      tenantImpl: pass,
      apiKeyImpl: (req, res) => res.status(403).json({ error: "Invalid API key" }),
      trackImpl: (req, res, next) => next(),
    });
    const invalidApp = createRouteTestApp("/ext/menu", invalidRouter);
    const invalid = await request(invalidApp).get("/ext/menu/");
    expect(invalid.status).toBe(403);

    const edgeRouter = await loadExternalMenuRouter({
      getMenuImpl: (req, res, next) => next(new Error("menu external fail")),
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const edgeApp = createRouteTestApp("/ext/menu", edgeRouter);
    const edge = await request(edgeApp).get("/ext/menu/");
    expect(edge.status).toBe(500);
  });
});
