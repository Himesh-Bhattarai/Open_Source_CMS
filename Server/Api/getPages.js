// controllers/getPages.js
import { Page } from "../Models/Page/Page.js";

export const getPagesVerification = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    const pages = await Page.find({
      tenantId,
      status: "published",
    })
      .select("title slug settings status updatedAt")
      .sort({ createdAt: -1 });

    res.json({ pages });
  } catch (err) {
    next(err);
  }
};

export const getPagesByIdVerification = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    const slugId = req.params.slug;

    if (!tenantId || !slugId) {
      return res.status(400).json({ error: "Missing required path params" });
    }

    const page = await Page.findOne({
      tenantId,
      slug: String(slugId),
      status: "published",
    })
      .select("title slug pageTree seo settings status publishedAt updatedAt tenantId")
      .lean();

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
};
