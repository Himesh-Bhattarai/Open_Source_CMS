import { Page } from "../../Models/Page/Page.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const pageCheckpoint = (req, res, next) => {
    try {
        const { tenantId, title, slug, blocks, seo, status} = req.body;
        const userId = req.user._id;
        if (!userId || !tenantId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        };

        log.info(`Page Creation Attempt by: ${userId} name: ${title}`)

        const page = Page.create({
            tenantId,
            title,
            slug,
            blocks,
            seo,
            status,
            publishedAt: Date.now(),
            authorId : userId
        });

        log.info(`Page created by: ${userId} name: ${title} Date: ${page.createdAt}`);

        res.status(200).json({
            message: "Page created successfully by " + userId,
        })
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
}