// server/models/Seo.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

/* ---------- Sub Schemas ---------- */

const RobotsGlobalSchema = new Schema(
    {
        indexPages: Boolean,
        followLinks: Boolean,
        sitemapEnabled: Boolean,
        sitemapUrl: String,
        robotsTxtEnabled: Boolean,
        stagingNoIndex: Boolean
    },
    { _id: false }
);

const RobotsPageSchema = new Schema(
    {
        index: Boolean,
        follow: Boolean,
        maxImagePreview: String,
        maxSnippet: Number,
        maxVideoPreview: Number
    },
    { _id: false }
);

const GlobalSEOSchema = new Schema(
    {
        general: {
            siteTitle: String,
            siteTitleSeparator: String,
            metaDescription: String,
            defaultOgImage: String,
            favicon: String,
            siteUrl: String
        },

        robots: RobotsGlobalSchema,

        social: {
            ogSiteName: String,
            twitterCard: String,
            twitterSite: String,
            facebookAppId: String
        },

        // ✅ IMPORTANT: frontend must send `schemaData`, NOT `schema`
        schemaData: {
            organizationName: String,
            organizationType: String,
            logo: String,
            socialProfiles: [String]
        },

        analytics: {
            googleAnalyticsId: String,
            googleTagManagerId: String,
            facebookPixelId: String
        }
    },
    { _id: false }
);

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

        breadcrumbs: {
            type: Array,
            default: []
        }
    },
    { _id: false }
);

/* ---------- Main SEO Schema ---------- */

const SeoSchema = new Schema(
    {
        // 🔑 CORE ID (website = tenant)
        tenantId: {
            type: String,
            required: true,
            index: true
        },

        scope: {
            type: String,
            enum: ["global", "page"],
            required: true,
            index: true
        },

        pageId: {
            type: String,
            index: true
        },

        globalSEO: GlobalSEOSchema,
        pageSEO: PageSEOSchema,

        meta: {
            environment: String,
            timestamp: Date
        }
    },
    { timestamps: true }
);

// 🚀 Prevent duplicate SEO per page
SeoSchema.index(
    { tenantId: 1, scope: 1, pageId: 1 },
    { unique: true, sparse: true }
);

export const Seo = models.Seo || model("Seo", SeoSchema);
