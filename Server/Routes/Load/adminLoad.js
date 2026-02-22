import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { User } from "../../Models/Client/User.js";
import express from "express";

const router = express.Router();

router.get("/get-all-users", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized");
    const actor = await User.findOne({ _id: userId, role: "admin" });
    if (!actor) throw new Error("Unauthorized");

    const users = await User.find({})
      .select("_id email name role status createdAt lastLogin")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ data: users });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
});

export default router;
