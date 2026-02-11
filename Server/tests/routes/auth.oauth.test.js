import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";

const loadOAuthRouter = async ({ tokenFactory } = {}) => {
  jest.resetModules();

  jest.unstable_mockModule("passport", () => ({
    default: {
      authenticate: (strategy, options = {}) => (req, res, next) => {
        if (req.path.includes("callback")) {
          if (req.query.fail === "1") {
            return res.redirect(options.failureRedirect || "/login");
          }
          req.user = { _id: "u1", role: "web-owner" };
          return next();
        }
        return res.redirect(302, `/mock-${strategy}`);
      },
    },
  }));

  jest.unstable_mockModule("../../Utils/Jwt/Jwt.js", () => ({
    generateTokens:
      tokenFactory ||
      (() => ({ accessToken: "access", refreshToken: "refresh" })),
  }));

  return (await import("../../Routes/Auth/oAuth/oAuth.js")).default;
};

describe("OAuth routes", () => {
  test("GET /auth/google valid entrypoint redirects", async () => {
    const router = await loadOAuthRouter();
    const app = createRouteTestApp("/oauth", router);

    const res = await request(app).get("/oauth/auth/google");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/mock-google");
  });

  test("GET /auth/google/callback valid sets cookies and redirects", async () => {
    const router = await loadOAuthRouter();
    const app = createRouteTestApp("/oauth", router);

    const res = await request(app).get("/oauth/auth/google/callback");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("http://localhost:3000/cms");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("GET /auth/google/callback edge token generation error redirects login", async () => {
    const router = await loadOAuthRouter({
      tokenFactory: () => {
        throw new Error("token failure");
      },
    });
    const app = createRouteTestApp("/oauth", router);

    const res = await request(app).get("/oauth/auth/google/callback");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/login");
  });

  test("GET /auth/facebook valid entrypoint redirects", async () => {
    const router = await loadOAuthRouter();
    const app = createRouteTestApp("/oauth", router);

    const res = await request(app).get("/oauth/auth/facebook");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/mock-facebook");
  });

  test("GET /auth/facebook/callback invalid auth redirects to failure path", async () => {
    const router = await loadOAuthRouter();
    const app = createRouteTestApp("/oauth", router);

    const res = await request(app).get("/oauth/auth/facebook/callback?fail=1");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/login");
  });

  test("GET /auth/facebook/callback edge token generation error redirects login", async () => {
    const router = await loadOAuthRouter({
      tokenFactory: () => {
        throw new Error("token failure");
      },
    });
    const app = createRouteTestApp("/oauth", router);

    const res = await request(app).get("/oauth/auth/facebook/callback");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/login");
  });
});
