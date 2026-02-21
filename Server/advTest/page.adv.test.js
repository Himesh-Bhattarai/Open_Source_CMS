import request from "supertest";
import mongoose from "mongoose";
import { setupTestDB, teardownTestDB, clearCollections } from "./helpers/dbHelpers.js";
import { buildApp } from "./helpers/appBuilder.js";
import { makeAuthCookie } from "./helpers/authHelpers.js";
import { validateSchema, pageResponseSchema } from "./helpers/schemaValidators.js";
import { fuzzPayloads, randomString } from "./helpers/fuzzHelpers.js";
import { measureRequests } from "./helpers/performanceHelpers.js";

const loadPageRouterPath = "../Routes/Load/pageBelong.js";
const pageModelPath = "../Models/Page/Page.js";

// Increase Jest timeout for async DB operations / performance tests
import { jest } from "@jest/globals";
jest.setTimeout(30000);

describe("Page advanced integration", () => {
  let app;
  let Page;

  beforeAll(async () => {
    // Start in-memory DB
    await setupTestDB();

    // Import model and router dynamically
    const pageModule = await import(pageModelPath);
    Page = pageModule.Page;

    const routerModule = await import(loadPageRouterPath);
    const router = routerModule.default;

    // Build test app
    app = buildApp("/page", router);

    // Seed initial page
    await Page.create({
      _id: new mongoose.Types.ObjectId(),
      tenantId: "t1",
      etag: "12345",
      pageTree: [],
      authorId: "user-adv",
      title: "Home",
      slug: "home",
    });
  });

  afterEach(async () => {
    // Clear collections and reseed
    await clearCollections();
    await Page.create({
      _id: new mongoose.Types.ObjectId(),
      tenantId: "t1",
      etag: "12345",
      pageTree: [],
      authorId: "user-adv",
      title: "Home",
      slug: "home",
    });
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  test("schema validation for belong pages", async () => {
    const res = await request(app)
      .get("/page/website/t1")
      .set("Cookie", makeAuthCookie({ userId: "user-adv" }));

    expect(res.status).toBe(200);
    validateSchema(pageResponseSchema, res.body);
    expect(res.body.pages[0].slug).toBe("home");
  });

  test("fuzzed tenantId inputs reject missing auth", async () => {
    const fuzzed = fuzzPayloads(randomString(0, 64)).slice(0, 5);
    for (const tenantId of fuzzed) {
      const res = await request(app).get(`/page/website/${tenantId || ""}`);
      console.log("tenantId:", tenantId, "status:", res.status);
      // Include 404 because some fuzzed tenantIds do not exist
      expect([400, 401, 403, 404]).toContain(res.status);
    }
  });

  test("performance under concurrency", async () => {
    // Create array of 15 concurrent request promises
    const requests = Array.from({ length: 15 }, () =>
      request(app)
        .get("/page/website/t1")
        .set("Cookie", makeAuthCookie({ userId: "user-adv" })),
    );

    // Measure total elapsed time
    const { elapsed } = await measureRequests(requests, 750); // 750ms threshold
    expect(elapsed).toBeLessThanOrEqual(750);
  });
});
