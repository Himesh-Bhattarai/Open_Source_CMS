import { Page } from "../../Models/Page/Page.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const pageCheckpoint = (req, res, next) => {
    try {
        const { userId, tenantId, name, slug, blocks, seo, status, publishedAt, publishedBy, authorId } = req.body;
        if (!userId || tenantId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        };

        log.info(`Page Creation Attempt by: ${userId} name: ${name}`)

        const page = Page.create({
            _id: userId,
            tenantId,
            name,
            slug,
            blocks,
            seo,
            status,
            publishedAt,
            publishedBy,
            authorId
        });

        log.info(`Page created by: ${userId} name: ${name} Date: ${page.createdAt}`);

        res.status(200).json({
            message: "Page created successfully by " + userId,
        })
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
}