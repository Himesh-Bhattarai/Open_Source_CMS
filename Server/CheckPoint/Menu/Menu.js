import { Menu } from "../../Models/Menu/Menu.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const menuCheckpoint = async (req, res, next) => {
    try {
        const { tenantId, userId, name, location, items, status, publishedAt, publishedBy } = req.body;

        if (!tenantId || !userId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Menu Creation Attempt by: ${userId}`)

        const menu = await Menu.create({
            tenantId,
            _id: userId,
            name,
            location,
            items,
            status,
            publishedAt: publishedAt || Date.now(),
            publishedBy: publishedBy || userId,
        });

        log.info(`Menu created by: ${userId} Date: ${menu.createdAt}`)

        res.status(200).json({
            message: "Menu created successfully by " + userId,
        })
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
}