import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { ApiKey } from "../../Models/ApiKey/apiKey.js";
import { Tenant } from "../../Models/Tenant/Tenant.js";

const router = express.Router();

/**
 * @route   GET /api/v1/api-keys/get-keys
 * @desc    Get all API keys for logged-in user with tenant mapping
 * @access  Private
 */
router.get(
  "/get-keys",
  verificationMiddleware,
  async (req, res, next) => {
    try {
      const userId = String(req.user?.userId || "");
      if (!userId) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      const userTenants = await Tenant.find({ userId }).select("_id name domain").lean();
      const tenantIds = userTenants.map((t) => String(t._id));

      const apiKeys = await ApiKey.find({
        $or: [
          { userId },
          ...(tenantIds.length ? [{ tenantId: { $in: tenantIds } }] : []),
        ],
      }).lean();

      if (!apiKeys.length) {
        return res.status(200).json({ ok: true, data: [] });
      }

      const apiKeyTenantIds = [
        ...new Set(apiKeys.map((k) => String(k.tenantId)).filter(Boolean)),
      ];

      const tenants = await Tenant.find({ _id: { $in: apiKeyTenantIds } })
        .select("name domain")
        .lean();

      const tenantMap = new Map(
        tenants.map((t) => [String(t._id), { name: t.name, domain: t.domain }]),
      );

      const deduped = new Map();
      for (const key of apiKeys) {
        deduped.set(String(key._id), key);
      }

      const response = Array.from(deduped.values()).map((key) => {
        const tenant = tenantMap.get(String(key.tenantId)) || {
          name: "Unknown Tenant",
          domain: "",
        };

        return {
          ...key,
          tenantName: tenant.name,
          tenantDomain: tenant.domain,
        };
      });

      return res.status(200).json({ ok: true, data: response });
    } catch (err) {
      err.statusCode = 500;
      next(err);
    }
  },
);

export default router;
