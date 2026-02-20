import { Media } from "../Models/Media/Media.js";

export const getMedia = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    const media = await Media.find({
      tenantId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      media,
    });
  } catch (err) {
    next(err);
  }
};
