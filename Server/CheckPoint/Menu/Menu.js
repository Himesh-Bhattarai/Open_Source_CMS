
import { Menu } from "../../Models/Menu/Menu.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const menuCheckpoint = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const {
            //tenant id need here for production no tenat 
            title,
            description,
            menuLocation,
            status,
            publishedAt,
            publishedBy,
        } = req.body;

        const tenantId = title + userId;
         
        if (!userId || !title || !menuLocation) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Menu creation attempt by user: ${userId}`);

        const newMenu = await Menu.create({
            userId,
            tenantId,
            title,
            description,
            menuLocation,
            status,
            publishedAt: publishedAt || Date.now(),
            publishedBy: publishedBy || userId,
            items: [], // 🔥 ALWAYS EMPTY AT FIRST
        });

        log.info(`Menu created: ${newMenu._id}`);

        res.status(201).json({
            success: true,
            menuId: newMenu._id,
        });
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
};
