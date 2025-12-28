import { Theme } from "../../Models/Theme/Theme.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const themeCheckpoint = (req, res, next) => {
    try {
        const { userId, tenantId, name, color, typography, layout, header, footer } = req.body;

        if (!userId || !tenantId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Theme Creation Attempt by: ${userId} name: ${name}`)

        const theme = Theme.create({
            _id: userId,
            tenantId,
            name,
            color,
            typography,
            layout,
            header,
            footer
        });

        log.info(`Theme created by: ${userId} name: ${name} Date: ${theme.createdAt}`);

        res.status(200).json({
            message: "Theme created successfully by " + userId
        })

    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
}