import { Media } from "../Models/Media/Media.js";

export const getMedia = async (req, res, next) => {
  try {
    const media = await Media.findOne({
      tenantId: req.tenant._id,
    });

    if (!media) throw new Error("Media not found");
    res.json({
      media,
    });
  } catch (err) {
    next(err);
  }
};
