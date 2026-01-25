import express from "express";
import passport from "passport";

const router = express.Router();

// Google
router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => res.redirect("http://localhost:3000/cms")
);

// Facebook
router.get("/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => res.redirect("/dashboard")
);

export default router;
