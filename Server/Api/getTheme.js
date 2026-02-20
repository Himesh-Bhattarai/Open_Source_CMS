import { Theme } from "../Models/Theme/Theme.js";

export const getTheme = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    const theme = await Theme.findOne({
      tenantId,
    }).lean();

    if (!theme) {
      return res.status(404).json({ error: "theme not found" });
    }
    return res.status(200).json({
      theme,
    });
  } catch (err) {
    next(err);
  }
};
