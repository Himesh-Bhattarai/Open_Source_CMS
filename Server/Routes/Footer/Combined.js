import express from "express";
import footer from "./Footer.js";
import footerBlock from "./FooterBlock.js";
import { Footer } from "../../Models/Footer/Footer.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.use("/footer", footer);
router.use("/footer-block", footerBlock);
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

    // Update footer
    const updatedFooter = await Footer.findByIdAndUpdate(
      footerId,
      req.body,
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
