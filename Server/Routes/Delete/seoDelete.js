import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";
import { Seo } from "../../Models/Seo/Seo.js";

const router = express.Router();

router.delete("/seo/:seoId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const seoId = req.params.seoId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!seoId) {
      return res.status(400).json({ message: "Missing seoId" });
    }

    const seo = await Seo.findById(seoId);
    if (!seo) {
      return res.status(404).json({ message: "Seo not found" });
    }

    if (String(seo.userId) !== String(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deleteSeo = await Seo.findByIdAndDelete(seoId);

    notif.deleteSEO({
      userId,
      seoName: deleteSeo?.seoName,
      seoId: deleteSeo?._id,
      websiteId: deleteSeo?.websiteId,
    });

    return res.status(200).json({ message: "Seo deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
