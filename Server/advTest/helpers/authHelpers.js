import jwt from "jsonwebtoken";

export const signAccessToken = (payload = { userId: "user-adv", role: "web-owner" }, opts = {}) => {
  const secret = process.env.ACCESS_TOKEN || "test-access-secret";
  return jwt.sign(payload, secret, { expiresIn: opts.expiresIn || "15m", ...opts });
};

export const makeAuthCookie = (payload, opts) => `accessToken=${signAccessToken(payload, opts)}`;

export const makeApiKeyHeader = (key = "adv-api-key") => ({ Authorization: `Bearer ${key}` });
