import { Footer } from "../Models/Footer/Footer.js";

export const getFooter = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    const footer = await Footer.findOne({
      tenantId,
      status: "published",
    }).lean();

    if (!footer) {
      return res.status(404).json({ error: "Footer not found" });
    }
    return res.status(200).json({
      footer,
    });
  } catch (err) {
    next(err);
  }
};
