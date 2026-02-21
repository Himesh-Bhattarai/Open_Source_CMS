import express from "express";
import { User } from "../Models/Client/User.js";
import { verificationMiddleware } from "../Utils/Jwt/Jwt.js";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/change-password", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { oldPassword, newPassword } = req.body;
    if (!userId) throw new Error("Unauthorized");

    const user = await User.findOne({ _id: userId });
    if (!user) throw new Error("User not found");

    if (!oldPassword || !newPassword) throw new Error("Password is not provided");

    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters long");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) throw new Error("Old password is not correct");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashedPassword;
    await user.save();

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Password changed successfully",
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
});

export default router;
