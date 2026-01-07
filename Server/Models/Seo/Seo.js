// seo schema
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

        // ✅ FIX: NEVER USE FIELD NAME `schema`
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
        userId: {
            type: String,
            required: true
        },

        websiteId: {
            type: String,
            required: true
        },

        scope: {
            type: String,
            enum: ["global", "page"],
            required: true
        },

        pageId: {
            type: String
        },

        globalSEO: GlobalSEOSchema,
        pageSEO: PageSEOSchema,

        meta: {
            environment: String,
            timestamp: Date
        }
    },
    {
        timestamps: true
    }
);

export const Seo = models.Seo || model("Seo", SeoSchema);
