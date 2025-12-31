import { Page } from "../../Models/Page/Page.js";
import { PageBlock } from "../../Models/Page/PageBlock.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const pageCheckpoint = async (req, res, next) => {
    try {
        const {title, slug, blocks = [] } = req.body;
        const userId = req.user?.userId;
        console.log("I am user", userId);

        // ✅ only user verification
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 1️⃣ create page (no blocks inside page yet)
        const page = await Page.create({
            title: title || "",
            slug: slug || "",
            authorId: userId,
            blocks: []
        });

        // 2️⃣ create blocks if provided
        if (blocks.length > 0) {
            const pageBlocks = await PageBlock.insertMany(
                blocks.map((block, index) => ({
                    ...block,
                    pageId: page._id,
                    order: index
                }))
            );

            page.blocks = pageBlocks.map(b => b._id);
            await page.save();
        }

        log.info(`Page created | user: ${userId} | page: ${page._id}`);

        res.status(201).json({
            pageId: page._id
        });

    } catch (err) {
        next(err);
    }
};
