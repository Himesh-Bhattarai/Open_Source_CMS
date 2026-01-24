import express from "express";
import mongoose from "mongoose";
import { Tenant } from "../../Models/Tenant/Tenant.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

const router = express.Router();

router.delete("/:tenantId", verificationMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user?.userId;
    const tenantId = req.params.tenantId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    log.info(`Delete Tenant Attempt: ${tenantId} by ${userId}`);

    // 1️⃣ Verify ownership
    const tenant = await Tenant.findOne({ _id: tenantId, userId }).session(
      session,
    );
    if (!tenant) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Tenant not found" });
    }

    // 2️⃣ Delete tenant (later you add cascading deletes here)
    await Tenant.deleteOne({ _id: tenantId }).session(session);

    await session.commitTransaction();
    session.endSession();

    notif.deleteWebsite({ userId, domain: tenant.domain, name: tenant.name, websiteId: tenant._id });
    

    res.json({ ok: true });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    log.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
