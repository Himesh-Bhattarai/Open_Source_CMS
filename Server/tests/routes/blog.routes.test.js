import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadBlogCreateRouter = async (handler) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Blog/BlogPost.js", () => ({
    BlogPostCheckpoint: handler,
  }));
  return (await import("../../Routes/Blog/Blog.js")).default;
};

const loadBlogCombinedRouter = async (handler) => {
  jest.resetModules();
  const blogStub = express.Router().post("/", (req, res) => res.status(200).json({ ok: true }));
  jest.unstable_mockModule("../../Routes/Blog/Blog.js", () => ({ default: blogStub }));
  jest.unstable_mockModule("../../CheckPoint/Blog/UpdateBlog.js", () => ({
    updateBlog: handler,
  }));
  return (await import("../../Routes/Blog/Combined.js")).default;
};

const loadBlogLoadRouter = async (blogPostModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Blog/Blogpost.js", () => ({
    BlogPost: blogPostModel,
  }));
  return (await import("../../Routes/Load/blog.js")).default;
};

const loadBlogDeleteRouter = async (blogPostModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Blog/Blogpost.js", () => ({
    BlogPost: blogPostModel,
  }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({
    cmsEventService: { deleteBlog: jest.fn() },
  }));
  return (await import("../../Routes/Delete/blogDelete.js")).default;
};

const loadExternalBlogRouter = async ({ getBlogImpl, tenantImpl, apiKeyImpl, trackImpl }) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Api/getBlog.js", () => ({ getBlog: getBlogImpl }));
  jest.unstable_mockModule("../../Validation/middleware/tenantVerification.js", () => ({
    tenantVerification: tenantImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/apiKeyVerification.js", () => ({
    apiKeyVerification: apiKeyImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/trackIntegrationUsage.js", () => ({
    trackIntegrationUsage: () => trackImpl,
  }));
  return (await import("../../Routes/Api/getBlog.js")).default;
};

describe("Blog routes", () => {
  test("POST create blog valid invalid edge", async () => {
    const router = await loadBlogCreateRouter((req, res) => res.status(201).json({ ok: true }));
    const app = createRouteTestApp("/blog", router);

    const valid = await request(app)
      .post("/blog/")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Post", slug: "post", status: "draft" });
    expect(valid.status).toBe(201);

    const invalid = await request(app)
      .post("/blog/")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Post", slug: "post", status: "bad" });
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadBlogCreateRouter((req, res, next) => next(new Error("blog fail")));
    const edgeApp = createRouteTestApp("/blog", edgeRouter);
    const edge = await request(edgeApp)
      .post("/blog/")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Post", slug: "post", status: "draft" });
    expect(edge.status).toBe(500);
  });

  test("PUT update blog valid invalid edge", async () => {
    const router = await loadBlogCombinedRouter((req, res) => res.status(200).json({ ok: true }));
    const app = createRouteTestApp("/combined", router);

    const valid = await request(app)
      .put("/combined/update-blog/b1")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Updated" });
    expect(valid.status).toBe(200);

    const invalid = await request(app).put("/combined/update-blog/b1").send({ title: "Updated" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadBlogCombinedRouter((req, res, next) => next(new Error("update fail")));
    const edgeApp = createRouteTestApp("/combined", edgeRouter);
    const edge = await request(edgeApp)
      .put("/combined/update-blog/b1")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Updated" });
    expect(edge.status).toBe(500);
  });

  test("GET load single blog valid invalid edge", async () => {
    const router = await loadBlogLoadRouter({
      findOne: jest.fn().mockResolvedValue({ _id: "b1", title: "Blog" }),
      find: jest.fn().mockResolvedValue([{ _id: "b1" }]),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/load/b1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/load/b1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadBlogLoadRouter({
      findOne: jest.fn().mockResolvedValue(null),
      find: jest.fn().mockResolvedValue([]),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp).get("/load/load/b1").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(404);
  });

  test("GET load all blogs valid invalid edge", async () => {
    const router = await loadBlogLoadRouter({
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([{ _id: "b1" }]),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/load-all").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/load-all");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadBlogLoadRouter({
      findOne: jest.fn(),
      find: jest.fn().mockRejectedValue(new Error("db fail")),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp).get("/load/load-all").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("DELETE blog valid invalid edge", async () => {
    const router = await loadBlogDeleteRouter({
      findOne: jest.fn().mockResolvedValue({ _id: "b1", slug: "x", title: "x" }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    });
    const app = createRouteTestApp("/delete", router);

    const valid = await request(app).delete("/delete/blog/b1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).delete("/delete/blog/b1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadBlogDeleteRouter({
      findOne: jest.fn().mockResolvedValue(null),
      deleteOne: jest.fn(),
    });
    const edgeApp = createRouteTestApp("/delete", edgeRouter);
    const edge = await request(edgeApp).delete("/delete/blog/b1").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(404);
  });

  test("External API blog list valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalBlogRouter({
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
      getBlogImpl: (req, res) => res.status(200).json({ blog: { id: "b1" } }),
    });
    const app = createRouteTestApp("/ext/blog", router);

    const valid = await request(app).get("/ext/blog/");
    expect(valid.status).toBe(200);

    const invalidRouter = await loadExternalBlogRouter({
      tenantImpl: (req, res) => res.status(400).json({ error: "Domain is required" }),
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
      getBlogImpl: (req, res) => res.status(200).json({ blog: { id: "b1" } }),
    });
    const invalidApp = createRouteTestApp("/ext/blog", invalidRouter);
    const invalid = await request(invalidApp).get("/ext/blog/");
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadExternalBlogRouter({
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
      getBlogImpl: (req, res, next) => next(new Error("external fail")),
    });
    const edgeApp = createRouteTestApp("/ext/blog", edgeRouter);
    const edge = await request(edgeApp).get("/ext/blog/");
    expect(edge.status).toBe(500);
  });

  test("External API blog by slug valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalBlogRouter({
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
      getBlogImpl: (req, res) => res.status(200).json({ blog: { slug: req.params.slug } }),
    });
    const app = createRouteTestApp("/ext/blog", router);

    const valid = await request(app).get("/ext/blog/hello");
    expect(valid.status).toBe(200);

    const invalidRouter = await loadExternalBlogRouter({
      tenantImpl: pass,
      apiKeyImpl: (req, res) => res.status(403).json({ error: "Invalid API key" }),
      trackImpl: (req, res, next) => next(),
      getBlogImpl: (req, res) => res.status(200).json({ blog: { slug: req.params.slug } }),
    });
    const invalidApp = createRouteTestApp("/ext/blog", invalidRouter);
    const invalid = await request(invalidApp).get("/ext/blog/hello");
    expect(invalid.status).toBe(403);

    const edgeRouter = await loadExternalBlogRouter({
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
      getBlogImpl: (req, res, next) => next(new Error("missing blog")),
    });
    const edgeApp = createRouteTestApp("/ext/blog", edgeRouter);
    const edge = await request(edgeApp).get("/ext/blog/hello");
    expect(edge.status).toBe(500);
  });
});
