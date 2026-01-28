import { Menu } from "../Models/Menu/Menu.js";

export const getMenu = async (req, res, next) => {
  try {
    console.log("Getting Menu");
    const getMenu = await Menu.find({
      tenantId: req.tenant._id,
    });
console.log(getMenu)
    if (!getMenu) throw new Error("Menu not Found");

    res.status(200).json({
      getMenu,
    });
  } catch (err) {
    next(err);
  }
};
