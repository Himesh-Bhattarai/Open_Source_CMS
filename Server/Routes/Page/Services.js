import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Page } from "../../Models/Page/Page.js";
import { Version } from "../../Models/Version/Version.js";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Is slug Available or not
router.get("/slug", verificationMiddleware, async (req, res, next) => {
  try {
    const { tenantId, slug } = req.query;
    const userId = req.user?.userId;

    if (!tenantId || !slug || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Page.findOne({ tenantId, slug });

    if (existing) {
      return res.status(200).json({
        available: false,
        availability: "TAKEN",
        message: "Slug already exists for this tenant",
      });
    }

    res.status(200).json({
      available: true,
      availability: "AVAILABLE",
      message: "Slug is available",
    });
  } catch (err) {
    next(err);
  }
});

//Ger user pages
router.get("/user-pages", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const pages = await Page.find({ authorId: userId });
    res.status(200).json(pages);
  } catch (err) {
    next(err);
  }
});

// Backward-compatible alias for legacy clients.
router.get("/get-page", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const pages = await Page.find({ authorId: userId });
    return res.status(200).json(pages);
  } catch (err) {
    next(err);
  }
});

// Get user page  and return page
router.get("/selected-page", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const pageId = req.query?.pageId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    if (!pageId) {
      return res.status(400).json({ message: "Missing pageId" });
    }
    if (!mongoose.Types.ObjectId.isValid(String(pageId))) {
      return res.status(400).json({ message: "Invalid pageId" });
    }

    const page = await Page.findOne({ _id: pageId, authorId: userId }).lean();
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const versions = await Version.find({
      entityType: "page",
      entityId: String(pageId),
    })
      .sort({ createdAt: -1 })
      .lean();

    const mappedVersions = versions.map((version, index) => ({
      id: String(version._id),
      versionNumber: versions.length - index,
      createdAt: version.createdAt,
      createdBy: version.createdBy,
      autoSave: Boolean(version.data?.meta?.autoSave),
      changes: Array.isArray(version.data?.meta?.changes) ? version.data.meta.changes : [],
    }));

    res.status(200).json({
      ...page,
      versions: mappedVersions,
      slugHistory: Array.isArray(page.slugHistory) ? page.slugHistory : [],
    });
  } catch (err) {
    next(err);
  }
});

router.get("/all-pages", verificationMiddleware, async (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const pages = await Page.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ pages });
  } catch (err) {
    next(err);
  }
});

export default router;
