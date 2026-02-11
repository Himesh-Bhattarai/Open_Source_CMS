import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadFormRouter = async (checkpointImpl, formModel) => {
  jest.resetModules();
  jest.unstable_mockModule("../../CheckPoint/Form/Form.js", () => ({ formCheckpoint: checkpointImpl }));
  jest.unstable_mockModule("../../Models/Form/Form.js", () => ({ Form: formModel }));
  jest.unstable_mockModule("../../Services/notificationServices.js", () => ({ cmsEventService: { updateForm: jest.fn() } }));
  return (await import("../../Routes/Form/Form.js")).default;
};

describe("Form create/update routes", () => {
  test("POST form valid invalid edge", async () => {
    const router = await loadFormRouter(
      (req, res) => res.status(201).json({ ok: true }),
      { findOneAndUpdate: jest.fn() },
    );
    const app = createRouteTestApp("/form", router);

    const valid = await request(app).post("/form/form").set("Cookie", makeAuthCookie()).send({ formName: "Contact" });
    expect(valid.status).toBe(201);

    const invalid = await request(app).post("/form/form").send({ formName: "Contact" });
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadFormRouter(
      (req, res, next) => next(new Error("form fail")),
      { findOneAndUpdate: jest.fn() },
    );
    const edgeApp = createRouteTestApp("/form", edgeRouter);
    const edge = await request(edgeApp).post("/form/form").set("Cookie", makeAuthCookie()).send({ formName: "Contact" });
    expect(edge.status).toBe(500);
  });

  test("PUT form valid invalid edge", async () => {
    const router = await loadFormRouter(
      (req, res) => res.status(201).json({ ok: true }),
      {
        findById: jest.fn().mockResolvedValue({ _id: "f1" }),
        findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: "f1" }),
      },
    );
    const app = createRouteTestApp("/form", router);

    const valid = await request(app)
      .put("/form/form/f1")
      .set("Cookie", makeAuthCookie())
      .send({ formName: "Updated" })
      .timeout({ response: 2000, deadline: 2000 });
    expect(valid.status).toBe(200);

    const invalid = await request(app)
      .put("/form/form/f1")
      .send({ formName: "Updated" })
      .timeout({ response: 2000, deadline: 2000 });
    expect(invalid.status).toBe(401);

    const edge = await request(app).get("/form/form/f1");
    expect(edge.status).toBe(404);
  });
});
