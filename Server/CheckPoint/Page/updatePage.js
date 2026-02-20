import crypto from "crypto";
import { Page } from "../../Models/Page/Page.js";
import { Version } from "../../Models/Version/Version.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";

const LOCK_ONLY_KEYS = new Set([
  "isLocked",
  "lockedBy",
  "lockedByName",
  "lockedAt",
]);

const ALLOWED_SETTINGS_KEYS = new Set([
  "pageType",
  "visibility",
  "featured",
  "allowComments",
  "template",
  "isHomepage",
]);

export const updatePagePhase2 = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { data, etag, options } = req.body || {};
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({ message: "Missing update payload" });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (String(page.authorId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const existingLock = page.settings?.locked || {};
    const isPageLocked = Boolean(existingLock?.isLocked);
    const lockedByUserId = existingLock?.byUserId
      ? String(existingLock.byUserId)
      : null;
    const requestedLockMutation = Object.prototype.hasOwnProperty.call(
      data,
      "isLocked",
    );
    const isLockedByOtherUser =
      isPageLocked && lockedByUserId && lockedByUserId !== String(userId);

    if (isLockedByOtherUser && !requestedLockMutation) {
      return res.status(423).json({ message: "Page is locked by another user" });
    }

    if (
      requestedLockMutation &&
      data.isLocked === true &&
      isLockedByOtherUser
    ) {
      return res.status(423).json({
        message: "Page is already locked by another user",
      });
    }

    if (!etag || etag !== page.etag) {
      return res.status(409).json({
        message: "This page was updated by another user. Reload required.",
      });
    }

    if (data.seo && typeof data.seo === "object") {
      if (data.seo.focusKeyword !== undefined)
        page.seo.focusKeyword = data.seo.focusKeyword;

      if (data.seo.metaTitle !== undefined)
        page.seo.metaTitle = data.seo.metaTitle;

      if (data.seo.metaDescription !== undefined)
        page.seo.metaDescription = data.seo.metaDescription;

      if (data.seo.canonicalUrl !== undefined)
        page.seo.canonicalUrl = data.seo.canonicalUrl;

      if (data.seo.openGraph !== undefined)
        page.seo.openGraph = data.seo.openGraph;

      if (data.seo.twitter !== undefined) page.seo.twitter = data.seo.twitter;

      if (data.seo.structuredData !== undefined) {
        page.seo.structuredData = normalizeStructuredData(data.seo.structuredData);
      }

      if (data.seo.robots !== undefined && data.seo.robots) {
        page.seo.robots = {
          index:
            typeof data.seo.robots.index === "boolean"
              ? data.seo.robots.index
              : true,
          follow:
            typeof data.seo.robots.follow === "boolean"
              ? data.seo.robots.follow
              : true,
          maxImagePreview: data.seo.robots.maxImagePreview || "large",
          maxSnippet:
            typeof data.seo.robots.maxSnippet === "number"
              ? data.seo.robots.maxSnippet
              : -1,
          maxVideoPreview:
            typeof data.seo.robots.maxVideoPreview === "number"
              ? data.seo.robots.maxVideoPreview
              : -1,
        };
      }

      if (data.seo.sitemapInclusion !== undefined) {
        page.seo.sitemapInclusion = Boolean(data.seo.sitemapInclusion);
      }
    }

    if (data.settings && typeof data.settings === "object") {
      for (const key of Object.keys(data.settings)) {
        if (ALLOWED_SETTINGS_KEYS.has(key)) {
          page.settings[key] = data.settings[key];
        }
      }
    }

    if (requestedLockMutation) {
      if (data.isLocked) {
        page.settings.locked = {
          isLocked: true,
          byUserId: String(data.lockedBy || userId),
          byUserName: data.lockedByName ? String(data.lockedByName) : null,
          lockedAt: data.lockedAt ? new Date(data.lockedAt) : new Date(),
        };
      } else {
        page.settings.locked = {
          isLocked: false,
          byUserId: null,
          byUserName: null,
          lockedAt: null,
        };
      }
    }

    if (data.status !== undefined) page.status = data.status;
    if (data.publishedAt !== undefined) page.publishedAt = data.publishedAt;

    page.etag = crypto.randomUUID();
    await page.save();

    const changedKeys = Object.keys(data || {});
    const shouldCreateVersion = changedKeys.some((key) => !LOCK_ONLY_KEYS.has(key));

    if (shouldCreateVersion) {
      await Version.create({
        _id: crypto.randomUUID(),
        tenantId: page.tenantId,
        entityType: "page",
        entityId: String(page._id),
        data: {
          snapshot: {
            seo: page.seo,
            settings: page.settings,
            status: page.status,
            publishedAt: page.publishedAt,
          },
          meta: {
            autoSave: Boolean(options?.autoSave),
            changes: changedKeys,
          },
        },
        createdBy: String(userId),
      });
    }

    notif.updatePage({
      userId,
      slug: page.slug,
      title: page.title,
      pageId: page._id,
      websiteId: page.tenantId,
    });

    return res.json({
      success: true,
      pageId: page._id,
      etag: page.etag,
      updatedAt: page.updatedAt,
    });
  } catch (error) {
    console.error("Phase-2 update failed:", error);
    return res
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
