import express from "express";

import MenuRoute from "./Menu.js";
import updateRoute from "./UpdateMenu.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Menu } from "../../Models/Menu/Menu.js";
const router = express.Router();

router.use("/menu", MenuRoute);
router.use("/menus", updateRoute);

router.post("/menu-item", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { menuId, item } = req.body || {};
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!menuId || !item) {
      return res.status(400).json({ message: "menuId and item are required" });
    }

    const menu = await Menu.findOne({ _id: menuId, userId: String(userId) });
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    menu.items = Array.isArray(menu.items) ? [...menu.items, item] : [item];
    await menu.save();

    return res.status(201).json({ ok: true, menu });
  } catch (err) {
    next(err);
  }
});

export default router;
