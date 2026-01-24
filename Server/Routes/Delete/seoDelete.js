import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Seo } from "../../Models/Seo/Seo.js";

const router = express.Router();

router.delete("/seo/:seoId", verificationMiddleware, async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new Error("Unauthorized");
  const seoId = req.params.seoId;

  if (!seoId) throw new Error("Missing seoId");

  const seo = await Seo.findById({ _id: seoId });

  if (!seo) throw new Error("Seo not found");

  if (seo.userId !== userId) throw new Error("Unauthorized");

  const deleteSeo = await Seo.findByIdAndDelete({ _id: seoId });

  res.status(200).json({ message: "Seo deleted successfully" });
});

export default router;
