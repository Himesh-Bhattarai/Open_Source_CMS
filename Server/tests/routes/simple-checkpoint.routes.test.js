import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

jest.setTimeout(20000);

const loadRouterWithMocks = async (routerPath, mockDefs) => {
  jest.resetModules();
  for (const [path, factory] of mockDefs) {
    jest.unstable_mockModule(path, factory);
  }
  return (await import(routerPath)).default;
};

describe("Simple checkpoint/validator route modules", () => {
  test("ActivityLog /activity-log valid invalid edge", async () => {
    const router = await loadRouterWithMocks("../../Routes/ActivityLog/ActivityLog.js", [
      [
        "../../CheckPoint/ActivityLog/ActivityLog.js",
        () => ({ ActivityLogCheckpoint: (req, res) => res.status(200).json({ ok: true }) }),
      ],
    ]);
    const app = createRouteTestApp("/activity", router);

    const valid = await request(app)
      .post("/activity/activity-log")
      .send({
        tenantId: "t1",
        action: "create",
        entityType: "page",
        entityId: "p1",
        details: { k: "v" },
        ipAddress: "127.0.0.1",
        userAgent: "jest",
      });
    expect(valid.status).toBe(200);

    const invalid = await request(app).post("/activity/activity-log").send({ tenantId: "t1" });
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadRouterWithMocks("../../Routes/ActivityLog/ActivityLog.js", [
      [
        "../../CheckPoint/ActivityLog/ActivityLog.js",
        () => ({ ActivityLogCheckpoint: (req, res, next) => next(new Error("activity crash")) }),
      ],
    ]);
    const edgeApp = createRouteTestApp("/activity", edgeRouter);
    const edge = await request(edgeApp)
      .post("/activity/activity-log")
      .send({
        tenantId: "t1",
        action: "create",
        entityType: "page",
        entityId: "p1",
        details: { k: "v" },
        ipAddress: "127.0.0.1",
        userAgent: "jest",
      });
    expect(edge.status).toBe(500);
    expect(edge.body.message).toBe("activity crash");
  });

  test("Fields /field valid invalid edge", async () => {
    const router = await loadRouterWithMocks("../../Routes/Fields/Combined.js", [
      [
        "../../CheckPoint/Field/Field/Field.js",
        () => ({ fieldCheckPoint: (req, res) => res.status(201).json({ ok: true }) }),
      ],
      [
        "../../CheckPoint/Field/ContentType/ContentType.js",
        () => ({ contentTypeCheckpoint: (req, res) => res.status(201).json({ ok: true }) }),
      ],
    ]);
    const app = createRouteTestApp("/fields", router);

    const valid = await request(app).post("/fields/field").send({
      id: "f1",
      name: "Title",
      type: "text",
      required: true,
      order: 1,
      options: null,
    });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post("/fields/field").send({ name: "Title" });
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadRouterWithMocks("../../Routes/Fields/Combined.js", [
      [
        "../../CheckPoint/Field/Field/Field.js",
        () => ({ fieldCheckPoint: (req, res, next) => next(new Error("field fail")) }),
      ],
      [
        "../../CheckPoint/Field/ContentType/ContentType.js",
        () => ({ contentTypeCheckpoint: (req, res) => res.status(201).json({ ok: true }) }),
      ],
    ]);
    const edgeApp = createRouteTestApp("/fields", edgeRouter);
    const edge = await request(edgeApp).post("/fields/field").send({
      id: "f1",
      name: "Title",
      type: "text",
      required: true,
      order: 1,
      options: null,
    });
    expect(edge.status).toBe(500);
  });

  test("Fields /content-type valid invalid edge", async () => {
    const router = await loadRouterWithMocks("../../Routes/Fields/Combined.js", [
      [
        "../../CheckPoint/Field/Field/Field.js",
        () => ({ fieldCheckPoint: (req, res) => res.status(201).json({ ok: true }) }),
      ],
      [
        "../../CheckPoint/Field/ContentType/ContentType.js",
        () => ({ contentTypeCheckpoint: (req, res) => res.status(201).json({ ok: true }) }),
      ],
    ]);
    const app = createRouteTestApp("/fields", router);

    const valid = await request(app).post("/fields/content-type").send({
      tenantId: "t1",
      name: "Blog",
      slug: "blog",
      fields: [],
    });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post("/fields/content-type").send({ tenantId: "t1" });
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadRouterWithMocks("../../Routes/Fields/Combined.js", [
      [
        "../../CheckPoint/Field/Field/Field.js",
        () => ({ fieldCheckPoint: (req, res) => res.status(201).json({ ok: true }) }),
      ],
      [
        "../../CheckPoint/Field/ContentType/ContentType.js",
        () => ({ contentTypeCheckpoint: (req, res, next) => next(new Error("ctype fail")) }),
      ],
    ]);
    const edgeApp = createRouteTestApp("/fields", edgeRouter);
    const edge = await request(edgeApp).post("/fields/content-type").send({
      tenantId: "t1",
      name: "Blog",
      slug: "blog",
      fields: [],
    });
    expect(edge.status).toBe(500);
  });

  test("Theme /theme valid invalid edge", async () => {
    const router = await loadRouterWithMocks("../../Routes/Theme/Theme.js", [
      [
        "../../CheckPoint/Theme/Theme.js",
        () => ({ themeCheckpoint: (req, res) => res.status(200).json({ ok: true }) }),
      ],
    ]);
    const app = createRouteTestApp("/theme", router);

    const valid = await request(app)
      .post("/theme/theme")
      .set("Cookie", makeAuthCookie())
      .send({ mode: "light" });
    expect(valid.status).toBe(200);

    const invalid = await request(app).post("/theme/theme").send({ mode: "light" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadRouterWithMocks("../../Routes/Theme/Theme.js", [
      [
        "../../CheckPoint/Theme/Theme.js",
        () => ({ themeCheckpoint: (req, res, next) => next(new Error("theme fail")) }),
      ],
    ]);
    const edgeApp = createRouteTestApp("/theme", edgeRouter);
    const edge = await request(edgeApp)
      .post("/theme/theme")
      .set("Cookie", makeAuthCookie())
      .send({ mode: "light" });
    expect(edge.status).toBe(500);
  });

  test("Media /media valid invalid edge", async () => {
    const router = await loadRouterWithMocks("../../Routes/Media/Media.js", [
      [
        "../../CheckPoint/Media/media.js",
        () => ({ mediaCheckpoint: (req, res) => res.status(201).json({ ok: true }) }),
      ],
    ]);
    const app = createRouteTestApp("/media", router);

    const valid = await request(app)
      .post("/media/media")
      .set("Cookie", makeAuthCookie())
      .send({ src: "x" });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post("/media/media").send({ src: "x" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadRouterWithMocks("../../Routes/Media/Media.js", [
      [
        "../../CheckPoint/Media/media.js",
        () => ({ mediaCheckpoint: (req, res, next) => next(new Error("media fail")) }),
      ],
    ]);
    const edgeApp = createRouteTestApp("/media", edgeRouter);
    const edge = await request(edgeApp)
      .post("/media/media")
      .set("Cookie", makeAuthCookie())
      .send({ src: "x" });
    expect(edge.status).toBe(500);
  });

  test("Version /version valid invalid edge", async () => {
    const router = await loadRouterWithMocks("../../Routes/Version/Version.js", [
      [
        "../../CheckPoint/Version/Version.js",
        () => ({ versionCheckpoint: (req, res) => res.status(201).json({ ok: true }) }),
      ],
    ]);
    const app = createRouteTestApp("/version", router);

    const valid = await request(app)
      .post("/version/version")
      .send({
        tenantId: "t1",
        entityType: "page",
        entityId: "p1",
        data: { a: 1 },
        createdBy: "u1",
      });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post("/version/version").send({ tenantId: "t1" });
    expect(invalid.status).toBe(400);

    const edgeRouter = await loadRouterWithMocks("../../Routes/Version/Version.js", [
      [
        "../../CheckPoint/Version/Version.js",
        () => ({ versionCheckpoint: (req, res, next) => next(new Error("version fail")) }),
      ],
    ]);
    const edgeApp = createRouteTestApp("/version", edgeRouter);
    const edge = await request(edgeApp)
      .post("/version/version")
      .send({
        tenantId: "t1",
        entityType: "page",
        entityId: "p1",
        data: { a: 1 },
        createdBy: "u1",
      });
    expect(edge.status).toBe(500);
  });

  test("Webhook route module is not present in current routing tree", async () => {
    await expect(import("../../Routes/Webhook/Webhook.js")).rejects.toThrow();
  });
});
