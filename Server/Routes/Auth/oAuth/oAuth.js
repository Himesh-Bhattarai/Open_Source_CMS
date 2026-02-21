import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { generateTokens, getCookieOptions } from "../../../Utils/Jwt/Jwt.js";
import { Session } from "../../../Models/Client/Session.js";

const router = express.Router();
const authRedirect = process.env.FRONTEND_AUTH_REDIRECT || "http://localhost:3000/cms";

// --- Helper to set cookies ---
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
};

// ---------------- Google OAuth ----------------
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    try {
      // Generate tokens for the user
      const { accessToken, refreshToken } = generateTokens({
        userId: req.user._id.toString(),
        role: req.user.role,
      });

      await Session.findOneAndUpdate(
        { userId: req.user._id.toString() },
        {
          $set: {
            email: req.user.email || `oauth-${req.user._id}@local.invalid`,
            refreshToken: await bcrypt.hash(refreshToken, 10),
            isActive: true,
          },
        },
        { upsert: true, new: true },
      );

      // Set cookies
      setAuthCookies(res, accessToken, refreshToken);

      // Redirect to frontend
      res.redirect(authRedirect);
    } catch (err) {
      console.error("OAuth Google Callback Error:", err);
      res.redirect("/login");
    }
  },
);

// ---------------- Facebook OAuth ----------------
router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    try {
      // Generate tokens for the user
      const { accessToken, refreshToken } = generateTokens({
        userId: req.user._id.toString(),
        role: req.user.role,
      });

      await Session.findOneAndUpdate(
        { userId: req.user._id.toString() },
        {
          $set: {
            email: req.user.email || `oauth-${req.user._id}@local.invalid`,
            refreshToken: await bcrypt.hash(refreshToken, 10),
            isActive: true,
          },
        },
        { upsert: true, new: true },
      );

      // Set cookies
      setAuthCookies(res, accessToken, refreshToken);

      // Redirect to frontend
      res.redirect(authRedirect);
    } catch (err) {
      console.error("OAuth Facebook Callback Error:", err);
      res.redirect("/login");
    }
  },
);

export default router;
