import { Seo } from "../Models/Seo/Seo.js";

export const getSeo = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id;

    const getSeo = await Seo.findOne({
      tenantId: tenantId,
    });

    if (!getSeo) throw new Error("Seo not Found");
    res.json({
      getSeo,
    });
  } catch (err) {
    next(err);
  }
};
