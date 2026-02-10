import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { ApiKey } from "../../Models/ApiKey/apiKey.js";
import { Tenant } from "../../Models/Tenant/Tenant.js";

const router = express.Router();

/**
 * @route   GET /api/v1/api-keys/get-keys
 * @desc    Get all API keys grouped by tenant for logged-in user
 * @access  Private
 */
router.get(
    "/get-keys",
    verificationMiddleware,
    async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }

            // 1️⃣ Fetch all API keys of user
            const apiKeys = await ApiKey.find({ userId })
                .select("-rawKey")
                .lean();

            if (!apiKeys.length) {
                return res.status(200).json({ ok: true, data: [] });
            }

            // 2️⃣ Group keys by tenantId
            const keysByTenant = {};
            for (const key of apiKeys) {
                const tenantId = key.tenantId.toString();
                if (!keysByTenant[tenantId]) keysByTenant[tenantId] = [];
                keysByTenant[tenantId].push(key);
            }

            // 3️⃣ Fetch tenant info
            const tenantIds = Object.keys(keysByTenant);

            const tenants = await Tenant.find({
                _id: { $in: tenantIds }
            })
                .select("name")
                .lean();

         
            const response = tenants.map(t => ({
                tenantId: t._id,
                tenantName: t.name,
                apiKeys: keysByTenant[t._id.toString()] || []
            }));

            return res.status(200).json({
                ok: true,
                data: response
            });

        } catch (err) {
            err.statusCode = 500;
            next(err);
        }
    }
);

export default router;
