import { Seo } from "../Models/Seo/Seo.js";

const normalizeScope = (scope) => {
  if (typeof scope !== "string") return "auto";
  const normalized = scope.trim().toLowerCase();
  if (normalized === "global" || normalized === "page") return normalized;
  return "auto";
};

export const getSeo = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    const requestedScope = normalizeScope(req.query?.scope);
    const pageId = typeof req.query?.pageId === "string" ? req.query.pageId.trim() : "";

    let getSeo = null;

    if (requestedScope === "global") {
      getSeo = await Seo.findOne({ tenantId, scope: "global" }).sort({ updatedAt: -1 }).lean();
    } else if (requestedScope === "page") {
      if (!pageId) {
        return res.status(400).json({ error: "pageId is required when scope=page" });
      }

      getSeo = await Seo.findOne({ tenantId, scope: "page", pageId })
        .sort({ updatedAt: -1 })
        .lean();
    } else {
      // Public consumers should receive global defaults first.
      getSeo = await Seo.findOne({ tenantId, scope: "global" }).sort({ updatedAt: -1 }).lean();

      // Fallback only when global SEO has not been created yet.
      if (!getSeo) {
        getSeo = await Seo.findOne({ tenantId }).sort({ updatedAt: -1 }).lean();
      }
    }

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
