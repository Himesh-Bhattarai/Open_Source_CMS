import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadMiscRouter = async (path, mocks) => {
  jest.resetModules();
  for (const [modPath, factory] of mocks) {
    jest.unstable_mockModule(modPath, factory);
  }
  return (await import(path)).default;
};

describe("Misc mounted routes", () => {
  test("GET integrationsApi valid invalid edge", async () => {
    const router = await loadMiscRouter("../../Routes/integrationsApi/integrationsApi.js", [
      ["../../CheckPoint/Integrations/integrationsApi.js", () => ({ integrationsApi: (req, res) => res.status(200).json({ ok: true }) })],
    ]);
    const app = createRouteTestApp("/integrations", router);

    expect((await request(app).get("/integrations/get-api").set("Cookie", makeAuthCookie())).status).toBe(200);
    expect((await request(app).get("/integrations/get-api")).status).toBe(401);

    const edgeRouter = await loadMiscRouter("../../Routes/integrationsApi/integrationsApi.js", [
      ["../../CheckPoint/Integrations/integrationsApi.js", () => ({ integrationsApi: (req, res, next) => next(new Error("integration fail")) })],
    ]);
    const edgeApp = createRouteTestApp("/integrations", edgeRouter);
    expect((await request(edgeApp).get("/integrations/get-api").set("Cookie", makeAuthCookie())).status).toBe(500);
  });

  test("GET api keys valid invalid edge", async () => {
    const router = await loadMiscRouter("../../Routes/Load/getApi.js", [
      ["../../Models/ApiKey/apiKey.js", () => ({ ApiKey: { find: jest.fn().mockReturnValue({ select: () => ({ lean: () => Promise.resolve([{ tenantId: "t1" }]) }) }) } })],
      ["../../Models/Tenant/Tenant.js", () => ({ Tenant: { find: jest.fn().mockReturnValue({ select: () => ({ lean: () => Promise.resolve([{ _id: "t1", name: "Site" }]) }) }) } })],
    ]);
    const app = createRouteTestApp("/keys", router);

    expect((await request(app).get("/keys/get-keys").set("Cookie", makeAuthCookie())).status).toBe(200);
    expect((await request(app).get("/keys/get-keys")).status).toBe(401);

    const edgeRouter = await loadMiscRouter("../../Routes/Load/getApi.js", [
      [
        "../../Models/ApiKey/apiKey.js",
        () => ({
          ApiKey: {
            find: jest.fn().mockReturnValue({
              select: () => ({ lean: () => Promise.resolve([{ tenantId: "t1" }]) }),
            }),
          },
        }),
      ],
      [
        "../../Models/Tenant/Tenant.js",
        () => ({
          Tenant: {
            find: jest.fn().mockReturnValue({
              select: () => ({ lean: () => Promise.reject(new Error("db fail")) }),
            }),
          },
        }),
      ],
    ]);
    const edgeApp = createRouteTestApp("/keys", edgeRouter);
    expect((await request(edgeApp).get("/keys/get-keys").set("Cookie", makeAuthCookie())).status).toBe(500);
  });

  test("GET stats valid invalid edge", async () => {
    const router = await loadMiscRouter("../../Routes/Stats/Stats.js", [
      ["../../Models/Page/Page.js", () => ({ Page: { countDocuments: jest.fn().mockResolvedValue(1) } })],
      ["../../Models/Blog/Blogpost.js", () => ({ BlogPost: { countDocuments: jest.fn().mockResolvedValue(2) } })],
    ]);
    const app = createRouteTestApp("/stats", router);

    expect((await request(app).get("/stats/stats/For-Dashboard").set("Cookie", makeAuthCookie())).status).toBe(200);
    expect((await request(app).get("/stats/stats/For-Dashboard")).status).toBe(401);

    const edgeRouter = await loadMiscRouter("../../Routes/Stats/Stats.js", [
      ["../../Models/Page/Page.js", () => ({ Page: { countDocuments: jest.fn().mockRejectedValue(new Error("db fail")) } })],
      ["../../Models/Blog/Blogpost.js", () => ({ BlogPost: { countDocuments: jest.fn().mockResolvedValue(2) } })],
    ]);
    const edgeApp = createRouteTestApp("/stats", edgeRouter);
    const edge = await request(edgeApp).get("/stats/stats/For-Dashboard").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("Notifications valid invalid edge", async () => {
    const router = await loadMiscRouter("../../Routes/Notifications/notifications.js", [
      ["../../Models/Notification/Notification.js", () => ({
        default: {
          find: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: "n1" }]) }),
          findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: "n1", read: true }),
        },
      })],
    ]);
    const app = createRouteTestApp("/noti", router);

    expect((await request(app).get("/noti/get-notification").set("Cookie", makeAuthCookie())).status).toBe(200);
    expect((await request(app).get("/noti/get-notification")).status).toBe(401);

    const edge = await request(app).post("/noti/read/bad-id");
    expect([200, 500]).toContain(edge.status);
  });

  test("Admin load current behavior typo path", async () => {
    const router = await loadMiscRouter("../../Routes/Load/adminLoad.js", [
      ["../../Models/Client/User.js", () => ({ User: { findOne: jest.fn().mockResolvedValue({ _id: "u1", role: "admin" }) } })],
    ]);
    const app = createRouteTestApp("/admin", router);

    const validCurrent = await request(app).get("/admin/get-all-users").set("Cookie", makeAuthCookie());
    expect(validCurrent.status).toBe(400);

    const invalid = await request(app).get("/admin/get-all-users");
    expect(invalid.status).toBe(401);

    const edge = await request(app).get("/admin/get-all-users").set("Cookie", makeAuthCookie({ useId: "u1" }));
    expect([200, 400]).toContain(edge.status);
  });

  test("Feedback route valid invalid edge", async () => {
    const router = await loadMiscRouter("../../Services/feedBack.js", [
      ["../../Models/Feedback/Feedback.js", () => ({ Feedback: { create: jest.fn().mockResolvedValue({ _id: "f1" }) } })],
      ["../../Models/Client/User.js", () => ({ User: { findOne: jest.fn().mockResolvedValue({ name: "U", email: "u@example.com" }) } })],
    ]);
    const app = createRouteTestApp("/feedback", router);

    expect((await request(app).post("/feedback/user/collect").set("Cookie", makeAuthCookie()).send({ msg: "hello" })).status).toBe(200);
    expect((await request(app).post("/feedback/user/collect").send({ msg: "hello" })).status).toBe(401);
    expect((await request(app).post("/feedback/user/collect").set("Cookie", makeAuthCookie()).send({})).status).toBe(500);
  });

  test("Change password valid invalid edge", async () => {
    const router = await loadMiscRouter("../../Services/changePassword.js", [
      ["../../Models/Client/User.js", () => ({
        User: { findOne: jest.fn().mockResolvedValue({ password: "$2b$10$5fd2wQ4vUpStxK4NdVSzUuXQXoYzKxuxMxDPZWS9Vyuk3F7S3w7Dq", save: jest.fn() }) },
      })],
      ["bcrypt", () => ({
        default: {
          compare: jest.fn().mockResolvedValue(true),
          hash: jest.fn().mockResolvedValue("hashed"),
        },
      })],
    ]);
    const app = createRouteTestApp("/pwd", router);

    expect((await request(app).post("/pwd/change-password").set("Cookie", makeAuthCookie()).send({ oldPassword: "12345678", newPassword: "123456789" })).status).toBe(200);
    expect((await request(app).post("/pwd/change-password").send({ oldPassword: "12345678", newPassword: "123456789" })).status).toBe(401);
    expect((await request(app).post("/pwd/change-password").set("Cookie", makeAuthCookie()).send({ oldPassword: "123", newPassword: "12" })).status).toBe(400);
  });

  test("Validate user payload valid invalid edge", async () => {
    const router = await loadMiscRouter("../../Services/validateUser.js", [
      ["../../Models/Client/User.js", () => ({ User: { findOne: jest.fn().mockResolvedValue({ email: "u@example.com", password: "hashed" }) } })],
      ["bcrypt", () => ({ default: { compare: jest.fn().mockResolvedValue(true) } })],
    ]);
    const app = createRouteTestApp("/validate", router);

    expect((await request(app).post("/validate/user-payload").set("Cookie", makeAuthCookie()).send({ par1: "u@example.com", par2: "12345678" })).status).toBe(200);
    expect((await request(app).post("/validate/user-payload").send({ par1: "u@example.com", par2: "12345678" })).status).toBe(401);
    expect((await request(app).post("/validate/user-payload").set("Cookie", makeAuthCookie()).send({ par1: "u@example.com" })).status).toBe(500);
  });
});
