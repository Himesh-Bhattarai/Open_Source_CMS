import { themeCheckpoint } from "../../CheckPoint/Theme/Theme.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import express from "express";
import { Theme } from "../../Models/Theme/Theme.js";

const router = express.Router();

router.post("/theme", verificationMiddleware, themeCheckpoint);
router.get("/theme/:websiteId", verificationMiddleware, async (req, res, next) => {
  try {
    const { websiteId } = req.params;
    const userId = req.user?.userId;

    if (!userId || !websiteId) {
      return res.status(400).json({ message: "websiteId is required" });
    }

    const theme = await Theme.findOne({
      tenantId: websiteId,
      "metadata.scope": "global",
    }).lean();

    return res.status(200).json({
      ok: true,
      theme: theme || null,
      message: theme ? "Theme loaded" : "Theme not found",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
