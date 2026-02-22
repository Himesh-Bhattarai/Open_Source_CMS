import express from "express";
import bcrypt from "bcrypt";
import { verifyRefreshToken, generateTokens, getCookieOptions } from "../../../Utils/Jwt/Jwt.js";
import { Session } from "../../../Models/Client/Session.js";
import { User } from "../../../Models/Client/User.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const refreshTokenCookie = req.cookies?.refreshToken;
    if (!refreshTokenCookie) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = await verifyRefreshToken(refreshTokenCookie);
    const user = await User.findById(decoded.userId).select("_id role status").lean();
    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: String(user._id),
      role: user.role,
    });

    await Session.findOneAndUpdate(
      { userId: String(user._id), isActive: true },
      { $set: { refreshToken: await bcrypt.hash(refreshToken, 10) } },
      { sort: { updatedAt: -1 } },
    );

    res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
});

export default router;
