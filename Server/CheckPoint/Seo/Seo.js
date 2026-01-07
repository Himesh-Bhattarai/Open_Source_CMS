import { Seo } from "../../Models/Seo/Seo.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const seoCheckpoint = async (req, res) => {
    try {


        const userId = req.user?.userId;

        const {
            websiteId,
            scope,
            pageId,
            globalSEO,
            pageSEO,
            meta
        } = req.body;

        console.log("Let me see the data Structure", req.body);

        /* ---------- HARD VALIDATIONS ---------- */

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!websiteId) {
            return res.status(400).json({ message: "websiteId is required" });
        }

        if (!scope || !["global", "page"].includes(scope)) {
            return res.status(400).json({ message: "Invalid SEO scope" });
        }

        if (scope === "page" && !pageId) {
            return res.status(400).json({
                message: "pageId is required when scope is page"
            });
        }

        if (scope === "global" && pageId) {
            return res.status(400).json({
                message: "pageId should not be provided for global SEO"
            });
        }

        if (!globalSEO) {
            return res.status(400).json({
                message: "globalSEO is required"
            });
        }

        /* ---------- BUILD DOCUMENT ---------- */

        const seoDocument = {
            userId,
            websiteId,
            scope,
            pageId: scope === "page" ? pageId : undefined,
            globalSEO,
            pageSEO: scope === "page" ? pageSEO : undefined,
            meta: {
                environment: meta?.environment,
                timestamp: meta?.timestamp || new Date()
            }
        };

        /* ---------- SAVE ---------- */

        const seo = await Seo.create(seoDocument);

        log.info("SEO saved successfully", {
            seoId: seo._id,
            websiteId,
            scope
        });

        return res.status(200).json({
            success: true,
            data: seo
        });

    } catch (error) {
        console.error(error);
        log.error("SEO checkpoint failed", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save SEO"
        });
    }
};
