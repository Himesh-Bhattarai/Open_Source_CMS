import { Menu } from "../../Models/Menu/Menu.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const menuCheckpoint = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { title, description, menuLocation, status, publishedAt, publishedBy } = req.body;

        if (!userId || !title || !menuLocation) {
            const err = new Error("Missing required fields: userId, title, or menuLocation");
            err.statusCode = 400;
            throw err;
        }

        const tenantId = title + userId; // Temporary logic, replace with real tenant in production

        log.info(`Menu creation attempt by user: ${userId}`);

        const newMenu = await Menu.create({
            userId,
            tenantId,
            title,
            description,
            menuLocation,
            status: status || "draft",
            publishedAt: publishedAt || null,
            publishedBy: publishedBy || null,
            items: [], // Phase 1 → always empty
        });

        log.info(`Menu created successfully: ${newMenu._id}`);

        res.status(201).json({
            success: true,
            menuId: newMenu._id,
        });
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
};
