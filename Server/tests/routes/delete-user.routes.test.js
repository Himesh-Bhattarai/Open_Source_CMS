import request from "supertest";
import { jest } from "@jest/globals";
import { createRouteTestApp } from "../helpers/createRouteTestApp.js";
import { makeAuthCookie } from "../helpers/auth.js";

const loadDeleteUserRouter = async ({ session, userModel }) => {
  jest.resetModules();
  jest.unstable_mockModule("mongoose", () => ({
    default: { startSession: jest.fn().mockResolvedValue(session) },
  }));
  jest.unstable_mockModule("../../Utils/Jwt/Jwt.js", () => ({
    verificationMiddleware: (req, res, next) => {
      const hasCookie = String(req.headers.cookie || "").includes("accessToken=");
      if (!hasCookie) {
        const err = new Error("No access token found");
        err.statusCode = 401;
        return next(err);
      }
      req.user = { userId: "user-1", role: "web-owner" };
      return next();
    },
  }));

  jest.unstable_mockModule("../../Models/Client/User.js", () => ({ User: userModel }));
  jest.unstable_mockModule("../../Models/Tenant/Tenant.js", () => ({
    Tenant: { deleteMany: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({}) }) },
  }));
  jest.unstable_mockModule("../../Models/Page/Page.js", () => ({
    Page: { deleteMany: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({}) }) },
  }));
  jest.unstable_mockModule("../../Models/Blog/Blogpost.js", () => ({
    BlogPost: {
      deleteMany: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({}) }),
    },
  }));
  jest.unstable_mockModule("../../Models/Menu/Menu.js", () => ({
    Menu: { deleteMany: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({}) }) },
  }));
  jest.unstable_mockModule("../../Models/Footer/Footer.js", () => ({
    Footer: { deleteMany: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({}) }) },
  }));
  jest.unstable_mockModule("../../Models/Seo/Seo.js", () => ({
    Seo: { deleteMany: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({}) }) },
  }));
  jest.unstable_mockModule("../../Models/Form/Form.js", () => ({
    Form: { deleteMany: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({}) }) },
  }));

  return (await import("../../Routes/Delete/deleteUser.js")).default;
};

describe("Delete user route", () => {
  test("DELETE permanent valid invalid edge", async () => {
    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    const router = await loadDeleteUserRouter({
      session,
      userModel: {
        findOne: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue({ _id: "u1" }) }),
        deleteOne: jest
          .fn()
          .mockReturnValue({ session: jest.fn().mockResolvedValue({ deletedCount: 1 }) }),
      },
    });
    const app = createRouteTestApp("/user", router);

    const valid = await request(app).delete("/user/permanent").set("Cookie", makeAuthCookie());
    expect(valid.status).toBe(200);

    const invalid = await request(app).delete("/user/permanent");
    expect(invalid.status).toBe(401);

    const edgeRouter = await loadDeleteUserRouter({
      session,
      userModel: {
        findOne: jest.fn().mockReturnValue({ session: jest.fn().mockResolvedValue(null) }),
        deleteOne: jest.fn(),
      },
    });
    const edgeApp = createRouteTestApp("/user", edgeRouter);
    const edge = await request(edgeApp).delete("/user/permanent").set("Cookie", makeAuthCookie());
    expect(edge.status).toBe(500);
  });
});
