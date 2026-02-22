import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

jest.setTimeout(20000);

const loadPageCreateRouter = async (handler) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Page/Page.js", () => ({ pageCheckpoint: handler }));
  return (await import("../../Routes/Page/Page.js")).default;
};

const loadPageUpdateRouter = async (handler) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Page/updatePage.js", () => ({
    updatePagePhase2: handler,
  }));
  return (await import("../../Routes/Page/updatePage.js")).default;
};

const loadPageServicesRouter = async (pageModel, versionModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Page/Page.js", () => ({ Page: pageModel }));
  if (versionModel) {
    jest.unstable_mockModule("../../Models/Version/Version.js", () => ({
      Version: versionModel,
    }));
  }
  return (await import("../../Routes/Page/Services.js")).default;
};

const loadPageBelongRouter = async (pageModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Page/Page.js", () => ({ Page: pageModel }));
  return (await import("../../Routes/Load/pageBelong.js")).default;
};

const loadPageDeleteRouter = async (pageModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Page/Page.js", () => ({ Page: pageModel }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({
    cmsEventService: { deletePage: jest.fn() },
  }));
  return (await import("../../Routes/Delete/pageDelete.js")).default;
};

const loadExternalPagesRouter = async ({ pageApi, tenantImpl, apiKeyImpl, trackImpl }) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Api/getPages.js", () => pageApi);
  jest.unstable_mockModule("../../Validation/middleware/tenantVerification.js", () => ({
    tenantVerification: tenantImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/apiKeyVerification.js", () => ({
    apiKeyVerification: apiKeyImpl,
  }));
  jest.unstable_mockModule("../../Validation/middleware/trackIntegrationUsage.js", () => ({
    trackIntegrationUsage: () => trackImpl,
  }));
  return (await import("../../Routes/Api/getPages.js")).default;
};

const loadSlugServiceRouter = async (pageModel, blogModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Page/Page.js", () => ({ Page: pageModel }));
  jest.unstable_mockModule("../../Models/Blog/Blogpost.js", () => ({ BlogPost: blogModel }));
  return (await import("../../Services/slugServices.js")).default;
};

describe("Page routes", () => {
  test("POST page create valid invalid edge", async () => {
    const router = await loadPageCreateRouter((req, res) => res.status(201).json({ ok: true }));
    const app = createRouteTestApp("/page", router);

    const valid = await request(app)
      .post("/page/")
      .set("Cookie", makeAuthCookie())
      .send({ tenantId: "t1", title: "Home", slug: "home", seo: {}, status: "draft" });
    expect(valid.status).toBe(201);

    const invalid = await request(app)
      .post("/page/")
      .set("Cookie", makeAuthCookie())
      .send({ title: "x" });
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadPageCreateRouter((req, res, next) => next(new Error("page fail")));
    const edgeApp = createRouteTestApp("/page", edgeRouter);
    const edge = await request(edgeApp)
      .post("/page/")
      .set("Cookie", makeAuthCookie())
      .send({ tenantId: "t1", title: "Home", slug: "home", seo: {}, status: "draft" });
    expect(edge.status).toBe(500);
  });

  test("PUT page update valid invalid edge", async () => {
    const router = await loadPageUpdateRouter((req, res) => res.status(200).json({ ok: true }));
    const app = createRouteTestApp("/page", router);

    const valid = await request(app)
      .put("/page/p1")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Updated" });
    expect(valid.status).toBe(200);

    const invalid = await request(app).put("/page/p1").send({ title: "Updated" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadPageUpdateRouter((req, res, next) =>
      next(new Error("update page fail")),
    );
    const edgeApp = createRouteTestApp("/page", edgeRouter);
    const edge = await request(edgeApp)
      .put("/page/p1")
      .set("Cookie", makeAuthCookie())
      .send({ title: "Updated" });
    expect(edge.status).toBe(500);
  });

  test("GET slug availability valid invalid edge", async () => {
    const router = await loadPageServicesRouter({
      findOne: jest.fn().mockResolvedValue(null),
      find: jest.fn().mockResolvedValue([{ _id: "p1" }]),
      findById: jest.fn().mockResolvedValue({ _id: "p1" }),
    });
    const app = createRouteTestApp("/svc", router);

    const valid = await request(app)
      .get("/svc/slug?tenantId=t1&slug=home")
      .set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);
    expect(valid.body.available).toBe(true);

    const invalid = await request(app).get("/svc/slug").set("Cookie", makeAuthCookie());
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadPageServicesRouter({
      findOne: jest.fn().mockResolvedValue({ _id: "p1" }),
      find: jest.fn().mockResolvedValue([{ _id: "p1" }]),
      findById: jest.fn().mockResolvedValue({ _id: "p1" }),
    });
    const edgeApp = createRouteTestApp("/svc", edgeRouter);
    const edge = await request(edgeApp)
      .get("/svc/slug?tenantId=t1&slug=home")
      .set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(200);
    expect(edge.body.available).toBe(false);
  });

  test("GET user pages valid invalid edge", async () => {
    const router = await loadPageServicesRouter({
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([{ _id: "p1" }]),
      findById: jest.fn().mockResolvedValue({ _id: "p1" }),
    });
    const app = createRouteTestApp("/svc", router);

    const valid = await request(app).get("/svc/user-pages").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/svc/user-pages");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadPageServicesRouter({
      findOne: jest.fn(),
      find: jest.fn().mockRejectedValue(new Error("db fail")),
      findById: jest.fn(),
    });
    const edgeApp = createRouteTestApp("/svc", edgeRouter);
    const edge = await request(edgeApp).get("/svc/user-pages").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("GET selected page valid invalid edge", async () => {
    const pageId = "507f191e810c19729de860ea";
    const router = await loadPageServicesRouter(
      {
        findOne: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: pageId,
            authorId: "user-1",
            slugHistory: [],
          }),
        }),
        find: jest.fn(),
        findById: jest.fn(),
      },
      {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([]),
          }),
        }),
      },
    );
    const app = createRouteTestApp("/svc", router);

    const valid = await request(app)
      .get(`/svc/selected-page?pageId=${pageId}`)
      .set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/svc/selected-page").set("Cookie", makeAuthCookie());
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadPageServicesRouter(
      {
        findOne: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null),
        }),
        find: jest.fn(),
        findById: jest.fn(),
      },
      {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([]),
          }),
        }),
      },
    );
    const edgeApp = createRouteTestApp("/svc", edgeRouter);
    const edge = await request(edgeApp)
      .get(`/svc/selected-page?pageId=${pageId}`)
      .set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(404);
  });

  test("GET page belong valid invalid edge", async () => {
    const router = await loadPageBelongRouter({
      find: jest.fn().mockResolvedValue([{ _id: "p1" }]),
    });
    const app = createRouteTestApp("/belong", router);

    const valid = await request(app).get("/belong/website/t1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/belong/website/t1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadPageBelongRouter({
      find: jest.fn().mockRejectedValue(new Error("db fail")),
    });
    const edgeApp = createRouteTestApp("/belong", edgeRouter);
    const edge = await request(edgeApp).get("/belong/website/t1").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("DELETE page valid invalid edge", async () => {
    const router = await loadPageDeleteRouter({
      findOneAndDelete: jest
        .fn()
        .mockResolvedValue({ _id: "p1", slug: "home", title: "Home", websiteId: "w1" }),
    });
    const app = createRouteTestApp("/delete", router);

    const valid = await request(app).delete("/delete/user-page/p1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).delete("/delete/user-page/p1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadPageDeleteRouter({
      findOneAndDelete: jest.fn().mockResolvedValue(null),
    });
    const edgeApp = createRouteTestApp("/delete", edgeRouter);
    const edge = await request(edgeApp)
      .delete("/delete/user-page/p1")
      .set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(404);
  });

  test("External pages list valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalPagesRouter({
      pageApi: {
        getPagesVerification: (req, res) => res.status(200).json({ pages: [] }),
        getPagesByIdVerification: (req, res) => res.status(200).json({ page: [] }),
      },
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const app = createRouteTestApp("/ext/pages", router);

    const valid = await request(app).get("/ext/pages/");
    expect(valid.status).toBe(200);

    const invalidRouter = await loadExternalPagesRouter({
      pageApi: {
        getPagesVerification: (req, res) => res.status(200).json({ pages: [] }),
        getPagesByIdVerification: (req, res) => res.status(200).json({ page: [] }),
      },
      tenantImpl: (req, res) => res.status(404).json({ error: "Tenant not found" }),
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const invalidApp = createRouteTestApp("/ext/pages", invalidRouter);
    const invalid = await request(invalidApp).get("/ext/pages/");
    expect(invalid.status).toBe(404);

    const edgeRouter = await loadExternalPagesRouter({
      pageApi: {
        getPagesVerification: (req, res, next) => next(new Error("pages fail")),
        getPagesByIdVerification: (req, res) => res.status(200).json({ page: [] }),
      },
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const edgeApp = createRouteTestApp("/ext/pages", edgeRouter);
    const edge = await request(edgeApp).get("/ext/pages/");
    expect(edge.status).toBe(500);
  });

  test("External page by slug valid invalid edge", async () => {
    const pass = (req, res, next) => {
      req.tenant = { _id: "t1" };
      next();
    };
    const router = await loadExternalPagesRouter({
      pageApi: {
        getPagesVerification: (req, res) => res.status(200).json({ pages: [] }),
        getPagesByIdVerification: (req, res) =>
          res.status(200).json({ page: [{ slug: req.params.slug }] }),
      },
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const app = createRouteTestApp("/ext/pages", router);

    const valid = await request(app).get("/ext/pages/home");
    expect(valid.status).toBe(200);

    const invalidRouter = await loadExternalPagesRouter({
      pageApi: {
        getPagesVerification: (req, res) => res.status(200).json({ pages: [] }),
        getPagesByIdVerification: (req, res) =>
          res.status(200).json({ page: [{ slug: req.params.slug }] }),
      },
      tenantImpl: pass,
      apiKeyImpl: (req, res) => res.status(403).json({ error: "Invalid API key" }),
      trackImpl: (req, res, next) => next(),
    });
    const invalidApp = createRouteTestApp("/ext/pages", invalidRouter);
    const invalid = await request(invalidApp).get("/ext/pages/home");
    expect(invalid.status).toBe(403);

    const edgeRouter = await loadExternalPagesRouter({
      pageApi: {
        getPagesVerification: (req, res) => res.status(200).json({ pages: [] }),
        getPagesByIdVerification: (req, res, next) => next(new Error("slug fail")),
      },
      tenantImpl: pass,
      apiKeyImpl: pass,
      trackImpl: (req, res, next) => next(),
    });
    const edgeApp = createRouteTestApp("/ext/pages", edgeRouter);
    const edge = await request(edgeApp).get("/ext/pages/home");
    expect(edge.status).toBe(500);
  });

  test("Slug service valid invalid edge", async () => {
    const router = await loadSlugServiceRouter(
      { findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }) },
      { findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }) },
    );
    const app = createRouteTestApp("/slug", router);

    const valid = await request(app)
      .get("/slug/slug?tenantId=t1&slug=home&value=PageCreation")
      .set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app)
      .get("/slug/slug?tenantId=t1&slug=home")
      .set("Cookie", makeAuthCookie());
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadSlugServiceRouter(
      {
        findOne: jest
          .fn()
          .mockReturnValue({ lean: jest.fn().mockRejectedValue(new Error("db fail")) }),
      },
      { findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }) },
    );
    const edgeApp = createRouteTestApp("/slug", edgeRouter);
    const edge = await request(edgeApp)
      .get("/slug/slug?tenantId=t1&slug=home&value=PageCreation")
      .set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });
});
