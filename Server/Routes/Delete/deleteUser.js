import express from "express";
import mongoose from "mongoose";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { User } from "../../Models/Client/User.js";
import { Tenant } from "../../Models/Tenant/Tenant.js";
import { Page } from "../../Models/Page/Page.js";
import { BlogPost } from "../../Models/Blog/Blogpost.js";
import { Menu } from "../../Models/Menu/Menu.js";
import { Footer } from "../../Models/Footer/Footer.js";
import { Seo } from "../../Models/Seo/Seo.js";
import { Form } from "../../Models/Form/Form.js";

const router = express.Router();

router.delete("/permanent", verificationMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized");

    //find user
    const user = await User.findOne({ _id: userId }).session(session);
    if (!user) throw new Error("User not found");

    // Delete all relational data manually (MongoDB doesn't support automatic cascading deletes natively without middleware)
    await Tenant.deleteMany({ userId }).session(session);
    await Page.deleteMany({ authorId: userId }).session(session);
    await BlogPost.deleteMany({ authorId: userId }).session(session);
    await Menu.deleteMany({ userId }).session(session);
    await Footer.deleteMany({ userId }).session(session);
    await Seo.deleteMany({ userId }).session(session);
    await Form.deleteMany({ userId }).session(session);

    // Finally delete the user
    await User.deleteOne({ _id: userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.clearCookie("token"); // Clear session/auth cookie
    res
      .status(200)
      .json({ ok: true, message: "Account and all associated data deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ ok: false, message: err.message });
  }
});

export default router;
