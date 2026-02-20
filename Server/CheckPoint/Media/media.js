import { Media } from "../../Models/Media/Media.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

export const mediaCheckpoint = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const {
      tenantId,
      filename,
      originalName,
      mimeType,
      size,
      width,
      height,
      url,
      altText,
      folder,
      scope,
      entityType,
      entityId,
      media: mediaInput,
      context,
    } = payload;

    const userId = req.user?.userId;
    const normalizedScope = scope || (context?.type ? context.type : "global");
    const normalizedEntityType =
      normalizedScope === "page" ? "page" : normalizedScope === "blog" ? "blog" : null;
    const normalizedEntityId =
      normalizedScope === "global" ? null : entityId || context?.id || null;

    const resolvedFilename = filename || mediaInput?.name;
    const resolvedOriginalName = originalName || mediaInput?.originalName || mediaInput?.name;
    const resolvedMimeType = mimeType || mediaInput?.mimeType || "";
    const resolvedSize = size ?? mediaInput?.size ?? 0;
    const resolvedUrl =
      url ||
      mediaInput?.url ||
      (resolvedFilename ? `/uploads/${encodeURIComponent(resolvedFilename)}` : "");
    const resolvedFolder =
      folder ||
      (normalizedScope === "global"
        ? "global"
        : `${normalizedScope}/${normalizedEntityId || "unassigned"}`);
    const resolvedStatus = mediaInput?.status || "ready";

    if (!userId || !tenantId || !resolvedFilename) {
      const err = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }
    if (normalizedScope !== "global" && !normalizedEntityId) {
      const err = new Error("Entity ID is required for page/blog media");
      err.statusCode = 400;
      throw err;
    }

    const createdMedia = await Media.create({
      userId,
      tenantId,
      scope: normalizedScope,
      entityType: normalizedEntityType,
      entityId: normalizedEntityId,
      filename: resolvedFilename,
      originalName: resolvedOriginalName,
      mimeType: resolvedMimeType,
      size: resolvedSize,
      width,
      height,
      status: resolvedStatus,
      url: resolvedUrl,
      altText,
      folder: resolvedFolder,
      uploadedBy: userId,
    });

    if (typeof notif.createMedia === "function") {
      notif.createMedia({
        userId,
        mediaName: createdMedia.filename,
        mediaId: createdMedia._id,
        websiteId: createdMedia.tenantId,
      });
    }

    res.status(201).json({
      ok: true,
      data: createdMedia,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
