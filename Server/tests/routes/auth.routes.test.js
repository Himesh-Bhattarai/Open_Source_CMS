import request from "supertest";
import { jest } from "@jest/globals";
import express from "express";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadLoginRouter = async (checkpointImpl) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Auth/Login/Login.js", () => ({
    loginCheckpoint: checkpointImpl,
  }));
  return (await import("../../Routes/Auth/Login/LoginRoute.js")).default;
};

const loadRegisterRouter = async (checkpointImpl) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Auth/Register/Register.js", () => ({
    registerCheckpoint: checkpointImpl,
  }));
  return (await import("../../Routes/Auth/Register/Register.js")).default;
};

const loadLogoutRouter = async (checkpointImpl) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Auth/Logout/Logout.js", () => ({
    logoutCheckpoint: checkpointImpl,
  }));
  return (await import("../../Routes/Auth/Logout/Logout.js")).default;
};

const loadAuthCombinedRouter = async (verifyMeImpl) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Validation/middleware/verifyMe.js", () => ({
    verifyMe: verifyMeImpl,
  }));

  const loginStub = express.Router().post("/", (req, res) =>
    res.status(200).json({ ok: true }),
  );
  const logoutStub = express.Router().post("/", (req, res) =>
    res.status(200).json({ ok: true }),
  );
  const registerStub = express.Router().post("/", (req, res) =>
    res.status(200).json({ ok: true }),
  );

  jest.unstable_mockModule("../../Routes/Auth/Login/LoginRoute.js", () => ({
    default: loginStub,
  }));

  jest.unstable_mockModule("../../Routes/Auth/Logout/Logout.js", () => ({
    default: logoutStub,
  }));

  jest.unstable_mockModule("../../Routes/Auth/Register/Register.js", () => ({
    default: registerStub,
  }));

  return (await import("../../Routes/Auth/Combined/Auth.js")).default;
};

describe("Auth route modules", () => {
  test("POST /login valid payload returns checkpoint response", async () => {
    const router = await loadLoginRouter((req, res) => res.status(200).json({ token: "ok" }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).post("/auth/").send({ email: "user@example.com", password: "12345678" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: "ok" });
  });

  test("POST /login invalid payload returns 400", async () => {
    const router = await loadLoginRouter((req, res) => res.status(200).json({ token: "ok" }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).post("/auth/").send({ email: "bad", password: "1" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  test("POST /login edge checkpoint failure returns 500", async () => {
    const router = await loadLoginRouter((req, res, next) => next(new Error("login failed")));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).post("/auth/").send({ email: "user@example.com", password: "12345678" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("login failed");
  });

  test("POST /register valid payload returns checkpoint response", async () => {
    const router = await loadRegisterRouter((req, res) => res.status(201).json({ ok: true }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).post("/auth/").send({
      email: "user@example.com",
      password: "12345678",
      name: "Himesh",
      role: "web-owner",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });
  });

  test("POST /register invalid payload returns 400", async () => {
    const router = await loadRegisterRouter((req, res) => res.status(201).json({ ok: true }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).post("/auth/").send({
      email: "user@example.com",
      password: "123",
      name: "A",
    });

    expect(res.status).toBe(400);
  });

  test("POST /register edge role enum mismatch returns 400", async () => {
    const router = await loadRegisterRouter((req, res) => res.status(201).json({ ok: true }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).post("/auth/").send({
      email: "user@example.com",
      password: "12345678",
      name: "Himesh",
      role: "owner",
    });

    expect(res.status).toBe(400);
  });

  test("POST /logout valid request returns checkpoint response", async () => {
    const router = await loadLogoutRouter((req, res) => res.status(200).json({ ok: true }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).post("/auth/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test("POST /logout invalid method GET returns 404", async () => {
    const router = await loadLogoutRouter((req, res) => res.status(200).json({ ok: true }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).get("/auth/");

    expect(res.status).toBe(404);
  });

  test("POST /logout edge checkpoint error returns 500", async () => {
    const router = await loadLogoutRouter((req, res, next) => next(new Error("logout failed")));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).post("/auth/");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("logout failed");
  });

  test("GET /profile valid cookie reaches verifyMe", async () => {
    const router = await loadAuthCombinedRouter((req, res) => res.status(200).json({ id: "u1" }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).get("/auth/profile").set("Cookie", makeAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "u1" });
  });

  test("GET /profile invalid no cookie returns 401", async () => {
    const router = await loadAuthCombinedRouter((req, res) => res.status(200).json({ id: "u1" }));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).get("/auth/profile");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No access token found");
  });

  test("GET /profile edge verifyMe error returns 500", async () => {
    const router = await loadAuthCombinedRouter((req, res, next) => next(new Error("profile failed")));
    const app = createRouteTestApp("/auth", router);

    const res = await request(app).get("/auth/profile").set("Cookie", makeAuthCookie());

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("profile failed");
  });
});
