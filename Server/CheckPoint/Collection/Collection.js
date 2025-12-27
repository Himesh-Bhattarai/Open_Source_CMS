import { Collection } from "../../Models/Collection/Collection";
import { logger as log } from "../../Utils/Logger/logger.js";

export const collectionCheckpoint = async (req, res, next) => {
    try {
        const { tenantId, userId, contentTypeId, data, status, publishedAt } =
            req.body;
        if (!tenantId || !userId || !contentTypeId || !data) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }
        log.info(
            `Collection Creation Attempt by: ${userId} contentTypeId: ${contentTypeId}`
        );

        const newCollection = await Collection.create({
            tenantId,
            contentTypeId,

            data,
            status,
            publishedAt,
            authorId: userId,
        });

        log.info(
            `Collection created by: ${userId} contentTypeId: ${contentTypeId} Date: ${newCollection.createdAt}`
        );
        res.status(200).json({
            message: "Collection created successfully by " + userId,
        });
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err)

    }

};
