import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Page } from "../../Models/Page/Page.js";
import express from "express";

const router = express.Router();
router.get("/", verificationMiddleware, async (req, res, next) => {
    try {
        const { tenantId, slug } = req.query;
        const userId = req.user?.userId;
        console.log("Slug check", tenantId, slug, userId);

        if (!tenantId || !slug || !userId) {
            throw new Error("Missing required fields");
        }

        const existing = await Page.findOne({ tenantId, slug });

        if (existing) {
            return res.status(200).json({
                available: false,
                availability: "TAKEN",
                message: "Slug already exists for this tenant"
            });
        }

        res.status(200).json({
            available: true,
            availability: "AVAILABLE",
            message: "Slug is available"
        });

    } catch (err) {
        next(err);
    }
});

export default router;