import express from "express";
import passport from "passport";
import { generateTokens } from "../../../Utils/Jwt/Jwt.js";

const router = express.Router();

// --- Helper to set cookies ---
const setAuthCookies = (res, accessToken, refreshToken) => {
    // Access token cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, 
    });

    // Refresh token cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30, 
    });
};

// ---------------- Google OAuth ----------------
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

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


            // Set cookies
            setAuthCookies(res, accessToken, refreshToken);

            // Redirect to frontend
            res.redirect("http://localhost:3000/cms");
        } catch (err) {
            console.error("OAuth Google Callback Error:", err);
            res.redirect("/login");
        }
    }
);

// ---------------- Facebook OAuth ----------------
router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

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


            // Set cookies
            setAuthCookies(res, accessToken, refreshToken);

            // Redirect to frontend
            res.redirect("http://localhost:3000/cms");
        } catch (err) {
            console.error("OAuth Facebook Callback Error:", err);
            res.redirect("/login");
        }
    }
);

export default router;
