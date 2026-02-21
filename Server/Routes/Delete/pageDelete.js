import express from "express";
import { Page } from "../../Models/Page/Page.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";
const router = express.Router();

//--------------------------[USER] DELETE PAGE BY ID--------------------------//
router.delete("/user-page/:id", verificationMiddleware, async (req, res) => {
  try {
    const pageId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const deleted = await Page.findOneAndDelete({
      _id: pageId,
      authorId: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Page not found or not owned" });
    }

    notif.deletePage({
      userId,
      slug: deleted.slug,
      title: deleted.title,
      pageId: deleted._id,
      websiteId: deleted.websiteId,
    });

    return res.status(200).json({ message: "Page deleted successfully" });
  } catch (err) {
    console.error("Error deleting page:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/user-pages", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const result = await Page.deleteMany({ authorId: String(userId) });
    return res.status(200).json({
      message: "All pages deleted successfully",
      deletedCount: result.deletedCount || 0,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/user-selected-page", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const pageIds = Array.isArray(req.body?.pageIds) ? req.body.pageIds : [];

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!pageIds.length) {
      return res.status(400).json({ message: "pageIds is required" });
    }

    const result = await Page.deleteMany({
      _id: { $in: pageIds },
      authorId: String(userId),
    });

    return res.status(200).json({
      message: "Selected pages deleted successfully",
      deletedCount: result.deletedCount || 0,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/pages/bulk-delete/byAdmin", verificationMiddleware, async (req, res, next) => {
  try {
    const role = req.user?.role;
    const userIds = Array.isArray(req.body?.userIds) ? req.body.userIds : [];

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!userIds.length) {
      return res.status(400).json({ message: "userIds is required" });
    }

    const result = await Page.deleteMany({
      authorId: { $in: userIds.map(String) },
    });

    return res.status(200).json({
      message: "Pages deleted successfully",
      deletedCount: result.deletedCount || 0,
    });
  } catch (err) {
    next(err);
  }
});
export default router;
