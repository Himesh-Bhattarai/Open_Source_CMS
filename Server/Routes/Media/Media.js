import express from "express";

import { mediaCheckpoint } from "../../CheckPoint/Media/media.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Media } from "../../Models/Media/Media.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";

const router = express.Router();

router.post("/media", verificationMiddleware, mediaCheckpoint);

router.get("/get-media", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { tenantId, scope, entityType, entityId, search, type, limit = "200" } = req.query;

    if (!userId || !tenantId) {
      return res.status(400).json({ ok: false, message: "tenantId is required" });
    }

    const filter = {
      userId: String(userId),
      tenantId: String(tenantId),
    };

    if (scope) filter.scope = String(scope);
    if (entityType) filter.entityType = String(entityType);
    if (entityId) filter.entityId = String(entityId);
    if (type) filter.mimeType = { $regex: `^${String(type)}/`, $options: "i" };
    if (search) filter.filename = { $regex: String(search), $options: "i" };

    const parsedLimit = Math.min(Number(limit) || 200, 500);

    const data = await Media.find(filter).sort({ createdAt: -1 }).limit(parsedLimit);

    return res.status(200).json({
      ok: true,
      data,
      count: data.length,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/media/:mediaId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const mediaId = req.params.mediaId;

    if (!userId || !mediaId) {
      return res.status(400).json({ ok: false, message: "Invalid request" });
    }

    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ ok: false, message: "Media not found" });
    }
    if (String(media.userId) !== String(userId)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    await Media.findByIdAndDelete(mediaId);

    if (typeof notif.deleteMedia === "function") {
      notif.deleteMedia({
        userId,
        mediaName: media.filename,
        mediaId: media._id,
        websiteId: media.tenantId,
      });
    }

    return res.status(200).json({ ok: true, message: "Media deleted", data: media });
  } catch (err) {
    next(err);
  }
});

export default router;
