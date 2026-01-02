import { Menu } from "../../Models/Menu/Menu.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const menuCheckpoint = async (req, res, next) => {
    try {
        const { tenantId, title,description, menuLocation, items, status, publishedAt, publishedBy } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Menu Creation Attempt by: ${userId}`)

        const newMenu = await Menu.create({
            tenantId,
            userId,
            title,
            description,
            menuLocation,
            items,
            status,
            publishedAt: publishedAt || Date.now(),
            publishedBy: publishedBy || userId,
        });

        log.info(`Menu created by: ${userId} Date: ${newMenu.createdAt}`)

        res.status(200).json({
            message: "Menu created successfully by " + userId,
            menuId : newMenu._id
        });

        
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
}