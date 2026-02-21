import request from "supertest";
import jwt from "jsonwebtoken";
import { buildApp } from "./helpers/appBuilder.js";
import { makeAuthCookie } from "./helpers/authHelpers.js";
import { jest } from "@jest/globals";
const authRouterPath = "../Routes/Auth/Combined/Auth.js";

jest.setTimeout(15000);

describe("Auth advanced", () => {
  test("expired token fails profile", async () => {
    const router = (await import(authRouterPath)).default;
    const app = buildApp("/auth", router);
    const expired = jwt.sign(
      { userId: "user-adv" },
      process.env.ACCESS_TOKEN || "test-access-secret",
      { expiresIn: "-1s" },
    );
    const res = await request(app).get("/auth/profile").set("Cookie", `accessToken=${expired}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/jwt expired/i);
  });

  test("schema stability via snapshot", async () => {
    const router = (await import(authRouterPath)).default;
    const app = buildApp("/auth", router);
    const res = await request(app)
      .get("/auth/profile")
      .set("Cookie", makeAuthCookie({ userId: "user-adv" }));
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(600);
    expect(res.body).toMatchSnapshot();
  });
});
