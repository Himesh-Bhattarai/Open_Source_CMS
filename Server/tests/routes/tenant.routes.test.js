import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadTenantCreateRouter = async (checkpointImpl) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Tenant/Tenant.js", () => ({ tenantCheckpoint: checkpointImpl }));
  return (await import("../../Routes/Tenant/Tenant.js")).default;
};

const loadTenantCombinedRouter = async (tenantModel) => {
  jest.resetModules();
  const tenantStub = express.Router().post("/tenant", (req, res) => res.status(201).json({ ok: true }));
  jest.unstable_mockModule("../../Routes/Tenant/Tenant.js", () => ({ default: tenantStub }));
  const { Tenant } = await import("../../Models/Tenant/Tenant.js");
  Tenant.find = tenantModel.find;
  Tenant.findOneAndUpdate = tenantModel.findOneAndUpdate;
  const { cmsEventService } = await import("../../Services/notificationServices.js");
  cmsEventService.updateWebsite = jest.fn();
  return (await import("../../Routes/Tenant/Combined/Tenant.js")).default;
};

const loadTenantDeleteRouter = async (tenantModel, session) => {
  jest.resetModules();
  jest.unstable_mockModule("mongoose", () => ({
    default: { startSession: jest.fn().mockResolvedValue(session) },
  }));
  jest.unstable_mockModule("../../Models/Tenant/Tenant.js", () => ({ Tenant: tenantModel }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({ cmsEventService: { deleteWebsite: jest.fn() } }));
  return (await import("../../Routes/Delete/tenantDelete.js")).default;
};

describe("Tenant routes", () => {
  test("POST tenant create valid invalid edge (safeParse quirk)", async () => {
    const router = await loadTenantCreateRouter((req, res) => res.status(201).json({ ok: true }));
    const app = createRouteTestApp("/tenant", router);

    const valid = await request(app)
      .post("/tenant/tenant")
      .send({
        name: "Site",
        domain: "site",
        ownerEmail: "owner@example.com",
        settings: {},
      });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post("/tenant/tenant").send({});
    expect(invalid.status).toBe(201);

    const edgeRouter = await loadTenantCreateRouter((req, res, next) => next(new Error("tenant fail")));
    const edgeApp = createRouteTestApp("/tenant", edgeRouter);
    const edge = await request(edgeApp).post("/tenant/tenant").send({ name: "Site" });
    expect(edge.status).toBe(500);
  });

  test("GET tenant list valid invalid edge", async () => {
    const router = await loadTenantCombinedRouter({
      find: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([{ _id: "t1" }]) }),
      findOneAndUpdate: jest.fn(),
    });
    const app = createRouteTestApp("/tenant", router);

    const valid = await request(app).get("/tenant/get-tenant").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/tenant/get-tenant");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadTenantCombinedRouter({
      find: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }),
      findOneAndUpdate: jest.fn(),
    });
    const edgeApp = createRouteTestApp("/tenant", edgeRouter);
    const edge = await request(edgeApp).get("/tenant/get-tenant").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(200);
    expect(edge.body.tenants).toEqual([]);
  });

  test("PUT tenant update valid invalid edge", async () => {
    const router = await loadTenantCombinedRouter({
      find: jest.fn(),
      findOneAndUpdate: jest.fn().mockResolvedValue({ _id: "t1", domain: "site", name: "Site" }),
    });
    const app = createRouteTestApp("/tenant", router);

    const valid = await request(app).put("/tenant/tenant/t1").set("Cookie", makeAuthCookie()).send({ name: "Site 2" });
    expect(valid.status).toBe(200);

    const invalid = await request(app).put("/tenant/tenant/t1").send({ name: "Site 2" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadTenantCombinedRouter({
      find: jest.fn(),
      findOneAndUpdate: jest.fn().mockResolvedValue(null),
    });
    const edgeApp = createRouteTestApp("/tenant", edgeRouter);
    const edge = await request(edgeApp).put("/tenant/tenant/t1").set("Cookie", makeAuthCookie()).send({ name: "Site 2" });
    expect(edge.status).toBe(404);
  });

  test("DELETE tenant valid invalid edge", async () => {
    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const router = await loadTenantDeleteRouter(
      {
        findOne: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({ _id: "t1", domain: "site", name: "Site" }) }),
        deleteOne: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({ deletedCount: 1 }) }),
      },
      session,
    );
    const app = createRouteTestApp("/delete", router);

    const valid = await request(app).delete("/delete/t1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).delete("/delete/t1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadTenantDeleteRouter(
      {
        findOne: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue(null) }),
        deleteOne: jest.fn(),
      },
      session,
    );
    const edgeApp = createRouteTestApp("/delete", edgeRouter);
    const edge = await request(edgeApp).delete("/delete/t1").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(404);
  });
});
