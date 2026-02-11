import express from "express";
import cookieParser from "cookie-parser";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { errorHandler } from "../../Utils/Logger/errorHandler.js";

export const buildApp = (mountPath, router) => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(mountPath, router);
  app.use(errorHandler);
  return app;
};

export const buildProtectedApp = (mountPath, router) => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use((req, res, next) => verificationMiddleware(req, res, next));
  app.use(mountPath, router);
  app.use(errorHandler);
  return app;
};
