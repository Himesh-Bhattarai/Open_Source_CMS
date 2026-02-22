import express from "express";
import footer from "./Footer.js";

import { Footer } from "../../Models/Footer/Footer.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.use("/footer", footer);

router.put("/footer/:id", verificationMiddleware, async (req, res, next) => {
  try {
    const footerId = req.params.id;
    const userId = req.user?.userId;

    if (!userId || !footerId) {
      return res.status(401).json({ message: "Forbidden" });
    }

    // Find footer by BOTH id and userId to prevent cross-user updates
    const existingFooter = await Footer.findOne({ _id: footerId, userId });

    if (!existingFooter) {
      return res.status(404).json({ message: "Footer not found" });
    }

    const incomingStatus =
      req.body?.status ??
      (req.body?.metadata?.status === "published" ? "published" : req.body?.metadata?.status);

    const payload = {
      ...req.body,
      status: incomingStatus ?? existingFooter.status,
    };

    if (payload.status === "published") {
      payload.publishedAt = payload.publishedAt || new Date();
      payload.publishedBy = payload.publishedBy || userId;
    } else if (payload.status === "draft") {
      payload.publishedAt = null;
      payload.publishedBy = null;
    }

    // Update footer
    const updatedFooter = await Footer.findByIdAndUpdate(
      footerId,
      payload,
      { new: true, runValidators: true }, // runValidators ensures schema is respected
    );

    return res.status(200).json({
      message: "Footer updated successfully",
      footer: updatedFooter,
    });
  } catch (error) {
    console.error("Error updating footer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
