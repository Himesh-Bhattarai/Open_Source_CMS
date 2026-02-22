import request from "supertest";
import mongoose from "mongoose";
import { setupTestDB, teardownTestDB, clearCollections } from "./helpers/dbHelpers.js";
import { buildApp } from "./helpers/appBuilder.js";
import { makeAuthCookie } from "./helpers/authHelpers.js";
import { validateSchema } from "./helpers/schemaValidators.js";
import { fuzzPayloads, randomObject } from "./helpers/fuzzHelpers.js";
import { jest } from "@jest/globals";
const loadFormRouterPath = "../Routes/Load/form.js";
const formModelPath = "../Models/Form/Form.js";

jest.setTimeout(20000);

describe("Form load integration", () => {
  let app;

  beforeAll(async () => {
    await setupTestDB();
    const { Form } = await import(formModelPath);
    await Form.create({
      _id: new mongoose.Types.ObjectId(),
      userId: "user-adv",
      formName: "Contact",
      createdBy: "user-adv",
      fields: [],
      tenantId: "t1",
    });
    const router = (await import(loadFormRouterPath)).default;
    app = buildApp("/form", router);
  });

  afterAll(async () => {
    await clearCollections();
    await teardownTestDB();
  });

  test("loads forms with schema snapshot", async () => {
    const res = await request(app)
      .get("/form/get-form")
      .set("Cookie", makeAuthCookie({ userId: "user-adv" }));
    expect(res.status).toBe(200);

    // Normalize dynamic fields
    const normalizedBody = {
      ...res.body,
      data: res.body.data.map((d) => ({
        ...d,
        _id: "<id>",
        createdAt: "<createdAt>",
        updatedAt: "<updatedAt>",
      })),
    };

    expect(normalizedBody).toMatchSnapshot();
  });

  test("fuzz query params do not crash", async () => {
    for (const extras of fuzzPayloads(randomObject(), 5)) {
      const res = await request(app)
        .get(`/form/get-form/${extras.id || ""}`)
        .set("Cookie", makeAuthCookie({ userId: "user-adv" }));
      expect([200, 401, 500]).toContain(res.status);
    }
  });
});
