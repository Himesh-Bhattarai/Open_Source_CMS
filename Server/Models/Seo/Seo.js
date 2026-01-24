// server/models/Seo.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

/* ---------- Sub Schemas ---------- */

// Robots settings for global SEO
const RobotsGlobalSchema = new Schema(
  {
    indexPages: Boolean,
    followLinks: Boolean,
    sitemapEnabled: Boolean,
    sitemapUrl: String,
    robotsTxtEnabled: Boolean,
    stagingNoIndex: Boolean,
  },
  { _id: false },
);

// Robots settings for page SEO
const RobotsPageSchema = new Schema(
  {
    index: Boolean,
    follow: Boolean,
    maxImagePreview: String,
    maxSnippet: Number,
    maxVideoPreview: Number,
  },
  { _id: false },
);

// Global SEO schema
const GlobalSEOSchema = new Schema(
  {
    general: {
      siteTitle: String,
      siteTitleSeparator: String,
      metaDescription: String,
      defaultOgImage: String,
      favicon: String,
      siteUrl: String,
    },
    robots: RobotsGlobalSchema,
    social: {
      ogSiteName: String,
      twitterCard: String,
      twitterSite: String,
      facebookAppId: String,
    },
    schemaData: {
      organizationName: String,
      organizationType: String,
      logo: String,
      socialProfiles: [String],
    },
    analytics: {
      googleAnalyticsId: String,
      googleTagManagerId: String,
      facebookPixelId: String,
    },
  },
  { _id: false },
);

// Page SEO schema
const PageSEOSchema = new Schema(
  {
    title: String,
    metaDescription: String,
    canonicalUrl: String,
    robots: RobotsPageSchema,
    ogImage: String,
    ogTitle: String,
    ogDescription: String,
    twitterCard: String,
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    schemaType: String,
    breadcrumbs: { type: Array, default: [] },
  },
  { _id: false },
);

/* ---------- Main SEO Schema ---------- */

const SeoSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true }, // website = tenant
    userId: { type: String, index: true },
    scope: {
      type: String,
      enum: ["global", "page"],
      required: true,
      index: true,
    },
    pageId: { type: String, index: true },
    globalSEO: GlobalSEOSchema,
    pageSEO: PageSEOSchema,
    meta: {
      environment: String,
      timestamp: Date,
    },
  },
  { timestamps: true },
);

/* ---------- Indexes to prevent duplicates ---------- */

// 1️⃣ Global SEO: only one per tenant
SeoSchema.index(
  { tenantId: 1, scope: 1 },
  { unique: true, partialFilterExpression: { scope: "global" } },
);

// 2️⃣ Page SEO: only one per tenant per page
SeoSchema.index(
  { tenantId: 1, scope: 1, pageId: 1 },
  { unique: true, partialFilterExpression: { scope: "page" } },
);

/* ---------- Export ---------- */

export const Seo = models.Seo || model("Seo", SeoSchema);
