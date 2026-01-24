// server/CheckPoint/Seo/Seo.js
import { Seo } from "../../Models/Seo/Seo.js";

export const seoCheckpoint = async (req, res) => {
  try {
    // 🔒 Normalize payload from frontend
    const seoPayload = req.body;
    const userId = req.user?.userId; // Make sure auth middleware sets this

    const { tenantId, scope, pageId, globalSEO, pageSEO, meta } = seoPayload;

    // 🔐 Validation
    if (!tenantId)
      return res.status(400).json({ message: "tenantId is required" });
    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!scope || !["global", "page"].includes(scope)) {
      return res.status(400).json({ message: "Invalid SEO scope" });
    }
    if (scope === "page" && !pageId) {
      return res
        .status(400)
        .json({ message: "pageId is required for page-level SEO" });
    }

    // 🧠 Build query for upsert
    const query = { tenantId, userId, scope };
    if (scope === "page") query.pageId = pageId;

    // 🧠 Build update payload
    const update = {
      tenantId,
      userId,
      scope,
      meta: {
        environment: meta?.environment || "production",
        timestamp: meta?.timestamp || new Date(),
      },
    };

    if (scope === "global") update.globalSEO = globalSEO;
    if (scope === "page") update.pageSEO = pageSEO;

    // 🚀 UPSERT
    const seo = await Seo.findOneAndUpdate(
      query,
      { $set: update },
      { new: true, upsert: true },
    );

    return res.status(200).json({ success: true, seo });
  } catch (error) {
    console.error("SEO checkpoint failed:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
