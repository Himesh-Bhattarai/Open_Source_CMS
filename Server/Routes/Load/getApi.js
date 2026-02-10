import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
// import { ApiKey } from "../../Models/ApiKey/apiKey.js";

const router = express.Router();

/**
 * @route GET /api/v1/api-keys/get-keys
 * @desc Get all API keys for the authenticated user
 * @access Private
 */
router.get("/get-keys",
    verificationMiddleware,
    async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

            const apiKeys = await ApiKey.find({
                userId: userId
            }).select("-keyHash").lean(); // Security: Never return the hash, use lean for performance

            return res.status(200).json({
                ok: true,
                data: apiKeys || []
            });
        } catch (err) {
            err.statusCode = 500;
            next(err);
        }
    }
);

export default router;