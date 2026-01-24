import crypto from "crypto";
import { Page } from "../../Models/Page/Page.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

export const updatePagePhase2 = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { data, etag } = req.body;
    const userId = req.user?.userId;

    const page = await Page.findById(pageId);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // ============================
    // 🔐 ETag Lock (version control)
    // ============================
    if (etag !== page.etag) {
      return res.status(409).json({
        message: "This page was updated by another user. Reload required.",
      });
    }

    // ============================
    // SEO — SAFE FIELD MERGE
    // ============================
    if (data.seo) {
      if (data.seo.metaTitle !== undefined)
        page.seo.metaTitle = data.seo.metaTitle;

      if (data.seo.metaDescription !== undefined)
        page.seo.metaDescription = data.seo.metaDescription;

      if (data.seo.canonicalUrl !== undefined)
        page.seo.canonicalUrl = data.seo.canonicalUrl;

      if (data.seo.openGraph !== undefined)
        page.seo.openGraph = data.seo.openGraph; // CORRECT FIELD

      if (data.seo.twitter !== undefined) page.seo.twitter = data.seo.twitter;

      if (data.seo.structuredData !== undefined)
        page.seo.structuredData = normalizeStructuredData(
          data.seo.structuredData,
        );
    }

    // ============================
    // SETTINGS — SAFE MERGE
    // ============================
    if (data.settings) {
      Object.keys(data.settings).forEach((key) => {
        page.settings[key] = data.settings[key];
      });
    }

    // ============================
    // STATUS
    // ============================
    if (data.status !== undefined) page.status = data.status;

    if (data.publishedAt !== undefined) page.publishedAt = data.publishedAt;

    // ============================
    // Bump version (ETag)
    // ============================
    page.etag = crypto.randomUUID();

    await page.save();

    notif.updatePage({ userId, slug: page.slug, title: page.title, pageId: page._id, websiteId: page.websiteId });

    res.json({
      success: true,
      pageId: page._id,
      etag: page.etag,
      updatedAt: page.updatedAt,
    });
  } catch (error) {
    console.error("Phase-2 Update Failed:", error);
    res
      .status(500)
      .json({ message: "Phase-2 update failed", error: error.message });
  }
};

function normalizeStructuredData(sd) {
  if (!sd || typeof sd !== "object") return {};

  return {
    "@context": sd["@context"] || "https://schema.org",
    "@type": sd["@type"] || "WebPage",
    ...sd,
  };
}
