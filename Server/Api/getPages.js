// controllers/getPages.js
import { Page } from "../Models/Page/Page.js";

export const getPagesVerification = async (req, res, next) => {
  try {
    const pages = await Page.find({
      tenantId: req.tenant._id,
    })
      .select("title slug settings")
      .sort({ createdAt: -1 });

    res.json({ pages });
  } catch (err) {
    next(err);
  }
};

export const getPagesByIdVerification = async (req, res, next) => {
  try {
    const slugId = req.params.slug;
    const page = await Page.find({
      tenantId: req.tenant._id,
      slug: slugId,
    })
      .select("Title Slug settings")
      .sort({ createdAt: -1 });

    if (!page) throw new Error("Page not found");
    res.json({
      page,
    });
  } catch (err) {
    next(err);
  }
};
