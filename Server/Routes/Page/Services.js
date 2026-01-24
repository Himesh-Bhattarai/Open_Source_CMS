import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Page } from "../../Models/Page/Page.js";
import express from "express";

const router = express.Router();

// Is slug Available or not
router.get("/slug", verificationMiddleware, async (req, res, next) => {
  try {
    const { tenantId, slug } = req.query;
    const userId = req.user?.userId;
    console.log("Slug check", tenantId, slug, userId);

    if (!tenantId || !slug || !userId) {
      throw new Error("Missing required fields");
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
    console.log("Fetching pages for user", userId);
    if (!userId) throw new Error("Unauthorized Access");

    const pages = await Page.find({ authorId: userId });
    if (!pages) throw new Error("No pages found for this user");
    res.status(200).json(pages);
  } catch (err) {
    next(err);
  }
});

// Get user page  and return page
router.get("/selected-page", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const pageId = req.query?.pageId;
    console.log("Did i am here ?");
    console.log("Let me see i get Page Id", pageId);

    if (!pageId) throw new Error("Missing fields required");

    const page = await Page.findById({ _id: pageId });
    if (!page) throw new Error("Page Not Found");
    console.log("Returning Page", page);
    res.status(200).json(page);
  } catch (err) {
    next(err);
  }
});

export default router;
