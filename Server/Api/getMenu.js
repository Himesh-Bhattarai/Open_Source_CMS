import { Menu } from "../Models/Menu/Menu.js";

export const getMenu = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    const getMenu = await Menu.find({
      tenantId,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      getMenu,
    });
  } catch (err) {
    next(err);
  }
};
