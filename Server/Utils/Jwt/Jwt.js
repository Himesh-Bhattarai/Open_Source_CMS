import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Session } from "../../Models/Client/Session.js";
dotenv.config();

//import Jwt secret form env
// refresh and access token with expire
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

const isProd = process.env.NODE_ENV === "production";

if (!REFRESH_TOKEN || !ACCESS_TOKEN) {
  throw new Error("ACCESS_TOKEN and REFRESH_TOKEN must be configured");
}

export const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge,
});

//Cookies Token Generation and Verification
export const generateTokens = (payload) => {
  const accessToken = jwt.sign({ ...payload, type: "access" }, ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN || "15m",
  });

  const refreshToken = jwt.sign({ userId: payload.userId, type: "refresh" }, REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN || "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN, {
    algorithms: ["HS256"],
  });
};

export const verifyRefreshToken = async (token) => {
  const decoded = jwt.verify(token, REFRESH_TOKEN);

  // Must check DB against hashed refresh token
  const session = await Session.findOne({
    userId: decoded.userId,
    isActive: true,
  }).sort({ updatedAt: -1 });

  if (!session?.refreshToken) throw new Error("Invalid refresh token");
  const isMatch = await bcrypt.compare(token, session.refreshToken);
  if (!isMatch) throw new Error("Invalid refresh token");

  return decoded;
};

//strong token verification middleware
export const verificationMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      const err = new Error("No access token found");
      err.statusCode = 401;
      return next(err);
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};
