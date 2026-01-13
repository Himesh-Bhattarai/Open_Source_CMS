import { Menu } from "../../Models/Menu/Menu.js";
import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.get("/menus", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized access");

    const menus = await Menu.find({ userId: userId });
    if (!menus) throw new Error("Menus not found");
    res.status(200).json({
      ok: true,
      menus: menus,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/menu/:menuId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const menuId = req.params.menuId;
    if (!userId) throw new Error("Unauthorized access");
    if (!menuId) throw new Error("Menu ID is required");

    const menu = await Menu.findOne({ _id: menuId, userId: userId });
    if (!menu) throw new Error("Menu not found");

    res.status(200).json(menu);
  } catch (err) {
    next(err);
  }
});
export default router;
