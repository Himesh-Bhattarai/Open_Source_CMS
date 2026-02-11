import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadFormLoadRouter = async (formModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../Models/Form/Form.js", () => ({ Form: formModel }));
  return (await import("../../Routes/Load/form.js")).default;
};

describe("Form load routes", () => {
  test("GET forms valid invalid edge", async () => {
    const router = await loadFormLoadRouter({
      find: jest.fn().mockResolvedValue([{ _id: "f1" }]),
      findById: jest.fn().mockResolvedValue({ _id: "f1" }),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/get-form").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/get-form");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadFormLoadRouter({
      find: jest.fn().mockRejectedValue(new Error("db fail")),
      findById: jest.fn(),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp).get("/load/get-form").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });

  test("GET form by id valid invalid edge", async () => {
    const router = await loadFormLoadRouter({
      find: jest.fn(),
      findById: jest.fn().mockResolvedValue({ _id: "f1" }),
    });
    const app = createRouteTestApp("/load", router);

    const valid = await request(app).get("/load/get-form/f1").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).get("/load/get-form/f1");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadFormLoadRouter({
      find: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
    });
    const edgeApp = createRouteTestApp("/load", edgeRouter);
    const edge = await request(edgeApp).get("/load/get-form/f1").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });
});
