import express from "express";
import crypto from "crypto";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Page } from "../../Models/Page/Page.js";
import { Version } from "../../Models/Version/Version.js";

const router = express.Router();

router.post("/page-version", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { pageId, data, autoSave = false, changes = [] } = req.body || {};
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!pageId) return res.status(400).json({ message: "pageId is required" });

    const page = await Page.findOne({ _id: pageId, authorId: String(userId) });
    if (!page) return res.status(404).json({ message: "Page not found" });
    const lockedBy = page.settings?.locked?.byUserId
      ? String(page.settings.locked.byUserId)
      : null;
    if (page.settings?.locked?.isLocked && lockedBy && lockedBy !== String(userId)) {
      return res.status(423).json({ message: "Page is locked by another user" });
    }

    const snapshot = data && typeof data === "object"
      ? data
      : {
          seo: page.seo,
          settings: page.settings,
          status: page.status,
          publishedAt: page.publishedAt,
        };

    const version = await Version.create({
      _id: crypto.randomUUID(),
      tenantId: page.tenantId,
      entityType: "page",
      entityId: String(page._id),
      data: {
        snapshot,
        meta: {
          autoSave: Boolean(autoSave),
          changes: Array.isArray(changes) ? changes : [],
        },
      },
      createdBy: String(userId),
    });

    return res.status(201).json({
      ok: true,
      data: version,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/page-version/:versionId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { versionId } = req.params;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!versionId) return res.status(400).json({ message: "versionId is required" });

    const version = await Version.findOne({
      _id: String(versionId),
      entityType: "page",
    });
    if (!version) return res.status(404).json({ message: "Version not found" });

    const page = await Page.findOne({
      _id: version.entityId,
      authorId: String(userId),
    });
    if (!page) return res.status(404).json({ message: "Page not found" });
    const lockedBy = page.settings?.locked?.byUserId
      ? String(page.settings.locked.byUserId)
      : null;
    if (page.settings?.locked?.isLocked && lockedBy && lockedBy !== String(userId)) {
      return res.status(423).json({ message: "Page is locked by another user" });
    }

    const snapshot = version.data?.snapshot || {};
    if (snapshot.seo && typeof snapshot.seo === "object") {
      page.seo = snapshot.seo;
    }
    if (snapshot.settings && typeof snapshot.settings === "object") {
      page.settings = snapshot.settings;
    }
    if (snapshot.status !== undefined) {
      page.status = snapshot.status;
    }
    if (snapshot.publishedAt !== undefined) {
      page.publishedAt = snapshot.publishedAt;
    }
    page.etag = crypto.randomUUID();

    await page.save();

    return res.status(200).json(page);
  } catch (err) {
    next(err);
  }
});

export default router;
