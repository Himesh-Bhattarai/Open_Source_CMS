import { Seo } from "../../Models/Seo/Seo.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";

export const seoCheckpoint = async (req, res) => {
  try {
    const seoPayload = req.body;
    const userId = req.user?.userId;

    const { tenantId, scope, pageId, globalSEO, pageSEO, meta } = seoPayload;

    // Validate the minimum context before upserting.
    if (!tenantId) {
      return res.status(400).json({ message: "tenantId is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!scope || !["global", "page"].includes(scope)) {
      return res.status(400).json({ message: "Invalid SEO scope" });
    }
    if (scope === "page" && !pageId) {
      return res
        .status(400)
        .json({ message: "pageId is required for page-level SEO" });
    }

    // One global record per tenant/user, or one record per page.
    const query = { tenantId, userId, scope };
    if (scope === "page") query.pageId = pageId;

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

    const seo = await Seo.findOneAndUpdate(
      query,
      { $set: update },
      { new: true, upsert: true },
    );

    notif.createSEO({
      userId,
      websiteName: tenantId,
      seoId: seo._id,
      websiteId: tenantId,
    });

    return res.status(200).json({ success: true, seo });
  } catch (error) {
    console.error("SEO checkpoint failed:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
