import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "../../Utils/Logger/errorHandler.js";

export const createRouteTestApp = (basePath, router) => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(basePath, router);
  app.use(errorHandler);
  return app;
};
