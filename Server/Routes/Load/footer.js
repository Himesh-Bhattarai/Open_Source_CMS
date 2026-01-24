import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Footer } from "../../Models/Footer/Footer.js";

const router = express.Router();

router.get("/get-footer", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("unauthorized");

    const footer = await Footer.findOne({ userId }).lean();

    if (!footer) throw new Error("Footer not found");

    return res.status(200).json(footer);
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
});

router.get(
  "/get-footer/:footerId",
  verificationMiddleware,
  async (req, res, next) => {
    const userId = req.user?.userId;
    const footerId = req.params.footerId;

    if (!userId || !footerId)
      return res.status(401).json({ message: "Unauthorized" });

    const footer = await Footer.findOne({ userId, _id: footerId }).lean();
    return res.status(200).json(footer);
  },
);

export default router;
