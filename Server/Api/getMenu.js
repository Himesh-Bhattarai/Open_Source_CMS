import { Menu } from "../../Models/Menu/Menu.js";

export const getMenu = async (req, res, next) => {
  try {
    const getMenu = await Menu.find({
      status: "published",
      tenantId: req.tenantId._id,
    });

    if (!getMenu) throw new Error("Menu not Found");

    res.json({
      getMenu,
    });
  } catch (err) {
    next(err);
  }
};
