import { Seo } from "../Models/Seo/Seo.js";

export const getSeo = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    const getSeo = await Seo.findOne({
      tenantId,
    }).lean();

    if (!getSeo) {
      return res.status(404).json({ error: "Seo not Found" });
    }
    return res.status(200).json({
      getSeo,
    });
  } catch (err) {
    next(err);
  }
};
