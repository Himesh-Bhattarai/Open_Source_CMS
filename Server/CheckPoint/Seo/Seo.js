// server/CheckPoint/Seo/Seo.js
import { Seo } from "../../Models/Seo/Seo.js";

export const seoCheckpoint = async (seoPayload) => {
    try {
        const {
            tenantId,
            scope,
            pageId,
            globalSEO,
            pageSEO,
            meta
        } = seoPayload;

        // 🔐 Hard validation
        if (!tenantId) {
            throw new Error("tenantId is required");
        }

        if (!scope || !["global", "page"].includes(scope)) {
            throw new Error("Invalid SEO scope");
        }

        if (scope === "page" && !pageId) {
            throw new Error("pageId is required for page-level SEO");
        }

        // 🧠 Build query
        const query = {
            tenantId,
            scope
        };

        if (scope === "page") {
            query.pageId = pageId;
        }

        // 🧠 Build update payload
        const update = {
            ...(globalSEO && { globalSEO }),
            ...(pageSEO && { pageSEO }),
            meta: {
                environment: meta?.environment || "production",
                timestamp: meta?.timestamp || new Date()
            }
        };

        // 🚀 UPSERT (create or update)
        const seo = await Seo.findOneAndUpdate(
            query,
            { $set: update },
            {
                new: true,
                upsert: true
            }
        );

        return seo;
    } catch (error) {
        console.error("SEO checkpoint failed:", error.message);
        throw error;
    }
};
