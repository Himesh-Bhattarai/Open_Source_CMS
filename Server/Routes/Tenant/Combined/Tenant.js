import express from "express";
import TenantRoute from "../Tenant.js";

import { verificationMiddleware } from "../../../Utils/Jwt/Jwt.js";
import { Tenant } from "../../../Models/Tenant/Tenant.js";
import { cmsEventService as notif } from "../../../Services/notificationServices.js";
import mongoose from "mongoose";

const router = express.Router();

const pickObject = (source, allowedKeys) => {
  const out = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(source || {}, key)) {
      out[key] = source[key];
    }
  }
  return out;
};

const normalizeDomain = (value = "") => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

router.use("/", TenantRoute);

router.get("/get-tenant", verificationMiddleware, async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Forbidden" });

  const tenants = await Tenant.find({ userId }).lean();

  return res.status(200).json({ tenants });
});

router.get("/get-selected-tenant/:tenantId", verificationMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const tenantId = req.params.tenantId;
    if (!userId) return res.status(401).json({ message: "Forbidden" });
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ message: "Invalid tenant id" });
    }

    const tenant = await Tenant.findOne({ _id: tenantId, userId: String(userId) }).lean();
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json(tenant);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load tenant" });
  }
});

// Backward-compatible alias for older client typo.
router.get("/get-selcted-tenant/:tenantId", verificationMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const tenantId = req.params.tenantId;
    if (!userId) return res.status(401).json({ message: "Forbidden" });
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ message: "Invalid tenant id" });
    }

    const tenant = await Tenant.findOne({ _id: tenantId, userId: String(userId) }).lean();
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json(tenant);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load tenant" });
  }
});

router.get("/all-tenants", verificationMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const tenants = await Tenant.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ tenants });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load tenants" });
  }
});

router.delete("/delete-all-tenants", verificationMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await Tenant.deleteMany({ userId: String(userId) });
    return res.status(200).json({ ok: true, message: "All tenants deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete tenants" });
  }
});

router.put("/tenant/:tenantId", verificationMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const tenantId = req.params.tenantId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ error: "Invalid tenant id" });
    }

    const payload = req.body || {};
    const safeUpdate = {
      ...pickObject(payload, ["name", "domain", "subdomain", "ownerEmail", "status", "plan"]),
    };

    if (safeUpdate.domain !== undefined) {
      safeUpdate.domain = normalizeDomain(safeUpdate.domain);
      if (!safeUpdate.domain) {
        return res.status(400).json({ error: "Invalid domain" });
      }
      const duplicateDomain = await Tenant.findOne({
        _id: { $ne: tenantId },
        domain: safeUpdate.domain,
      }).lean();
      if (duplicateDomain) {
        return res.status(409).json({ error: "Domain is already in use" });
      }
    }

    if (payload.settings && typeof payload.settings === "object") {
      safeUpdate.settings = pickObject(payload.settings, [
        "siteName",
        "timezone",
        "language",
        "dateFormat",
      ]);
    }

    if (payload.integrations && typeof payload.integrations === "object") {
      safeUpdate.integrations = pickObject(payload.integrations, [
        "pages",
        "footer",
        "navbar",
        "theme",
        "seo",
      ]);
    }

    const tenant = await Tenant.findOneAndUpdate(
      { _id: tenantId, userId: String(userId) },
      { $set: safeUpdate },
      { new: true },
    );

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found or access denied" });
    }

    notif.updateWebsite({
      userId,
      domain: tenant.domain,
      name: tenant.name,
      websiteId: tenant._id,
    });

    res.json({
      ok: true,
      data: tenant,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Domain is already in use" });
    }
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;
