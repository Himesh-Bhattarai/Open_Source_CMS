import express from "express";
import request from "supertest";
import { csrfProtection } from "../../Validation/middleware/csrfProtection.js";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use(csrfProtection);
  app.post("/write", (req, res) => res.status(200).json({ ok: true }));
  app.get("/read", (req, res) => res.status(200).json({ ok: true }));
  return app;
};

describe("csrfProtection middleware", () => {
  const originalCors = process.env.CORS_ORIGIN;
  const originalFrontend = process.env.FRONTEND_AUTH_REDIRECT;
  const originalToggle = process.env.CSRF_PROTECTION;

  beforeEach(() => {
    process.env.CORS_ORIGIN = "https://cms.example.com";
    process.env.FRONTEND_AUTH_REDIRECT = "";
    delete process.env.CSRF_PROTECTION;
  });

  afterAll(() => {
    process.env.CORS_ORIGIN = originalCors;
    process.env.FRONTEND_AUTH_REDIRECT = originalFrontend;
    process.env.CSRF_PROTECTION = originalToggle;
  });

  test("allows unsafe request with cookie when origin is allowlisted", async () => {
    const app = buildApp();

    const response = await request(app)
      .post("/write")
      .set("Cookie", "accessToken=test")
      .set("Origin", "https://cms.example.com")
      .send({ ok: true });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  test("blocks unsafe request with cookie when origin is not allowlisted", async () => {
    const app = buildApp();

    const response = await request(app)
      .post("/write")
      .set("Cookie", "accessToken=test")
      .set("Origin", "https://attacker.example.com")
      .send({ ok: true });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/CSRF check failed/i);
  });

  test("allows unsafe request without cookie auth", async () => {
    const app = buildApp();

    const response = await request(app).post("/write").send({ ok: true });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  test("skips protection for safe methods", async () => {
    const app = buildApp();

    const response = await request(app)
      .get("/read")
      .set("Cookie", "accessToken=test")
      .set("Origin", "https://attacker.example.com");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
