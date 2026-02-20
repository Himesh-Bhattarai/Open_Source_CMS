import express from "express";
import TenantRoute from "../Tenant.js";

import { verificationMiddleware } from "../../../Utils/Jwt/Jwt.js";
import { Tenant } from "../../../Models/Tenant/Tenant.js";
import {cmsEventService as notif} from "../../../Services/notificationServices.js"
import mongoose from "mongoose";

const router = express.Router();

router.use("/", TenantRoute);


router.get("/get-tenant", verificationMiddleware, async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Forbidden" });

  const tenants = await Tenant.find({ userId }).lean();

  return res.status(200).json({ tenants });
});

router.put("/tenant/:tenantId", verificationMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const tenantId = req.params.tenantId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ error: "Invalid tenant id" });
    }

    const update = req.body;

    const tenant = await Tenant.findOneAndUpdate(
      { _id: tenantId, userId: String(userId) },
      { $set: update },
      { new: true },
    );

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found or access denied" });
    }

    notif.updateWebsite({ userId, domain: tenant.domain, name: tenant.name, websiteId: tenant._id });

    res.json({
      ok: true,
      data: tenant,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;
