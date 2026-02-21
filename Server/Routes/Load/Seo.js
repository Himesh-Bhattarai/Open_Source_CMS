import express from "express";
import { Seo } from "../../Models/Seo/Seo.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
const router = express.Router();

router.get("/get-seo-settings", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized");

    const getSeo = await Seo.find({ userId });
    if (!getSeo) throw new Error("Seo not found");

    return res.status(200).json({ data: getSeo });
  } catch (err) {
    next(err);
  }
});

router.get("/get-seo-settings/:seoId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const seoId = req.params.seoId;
    if (!userId) throw new Error("Unauthorized");
    if (!seoId) throw new Error("Seo ID is required");

    const getSeo = await Seo.findOne({ userId, _id: seoId });
    if (!getSeo) throw new Error("Seo not found");
    return res.status(200).json({ data: getSeo });
  } catch (err) {
    next(err);
  }
});

export default router;
