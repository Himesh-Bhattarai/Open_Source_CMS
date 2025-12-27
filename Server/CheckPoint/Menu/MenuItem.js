import { MenuItem } from "../../Models/Menu/MenuItem.js";

import { logger as log } from "../../Utils/Logger/logger.js";

export const menuItemCheckpoint = async (req, res, next) => {
    try {
        const { userId, label, link, order, type } = req.body
        if (!userId) {
            const err = new Error("User Id is required");
            err.statusCode = 400;
            throw err;
        };

        log.info(`Menu Item Creation Attempt by: ${userId}`)

        const menuItem = await MenuItem.create({
            _id: userId,
            label,
            link,
            order,
            type
        });

        log.info(`Menu Item created by: ${userId} Date: ${menuItem.createdAt}`)

        res.status(200).json({
            message: "Menu Item created successfully by " + userId,
        })
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
}