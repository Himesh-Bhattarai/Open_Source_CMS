import jwt from "jsonwebtoken";

export const makeAccessToken = (payload = { userId: "user-1", role: "web-owner" }) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN);

export const makeAuthCookie = (payload) => `accessToken=${makeAccessToken(payload)}`;
