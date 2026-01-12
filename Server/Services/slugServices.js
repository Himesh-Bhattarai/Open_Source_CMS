import express from 'express';
import { Page } from "../Models/Page/Page.js";
import { verificationMiddleware } from '../Utils/Jwt/Jwt.js';
import { BlogPost } from '../Models/Blog/Blogpost.js';
const router = express.Router();
// Is slug Available or not
router.get("/slug", verificationMiddleware, async (req, res) => {
    try {
        const { tenantId, slug, value } = req.query;
        const userId = req.user?.userId;

        if (!tenantId || !slug || !userId || !value) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // normalize slug
        const normalizedSlug = String(slug)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

        let existing = null;

        if (value === "BlogCreation") {
            existing = await BlogPost.findOne({
                tenantId,
                slug: normalizedSlug,
            }).lean();
        }

        else if (value === "PageCreation") {
            existing = await Page.findOne({
                tenantId,
                slug: normalizedSlug,
            }).lean();
        }

        else {
            return res.status(400).json({ message: "Invalid value parameter" });
        }

        return res.status(200).json({
            available: !existing,
            availability: existing ? "TAKEN" : "AVAILABLE",
        });

    } catch (err) {
        console.error("Slug check error:", err);
        return res.status(500).json({ message: "Slug check failed" });
    }
});

export default router;