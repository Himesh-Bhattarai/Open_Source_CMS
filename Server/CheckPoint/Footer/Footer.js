import { Footer } from "../../Models/Footer/Footer";
import { logger as log } from "../../Utils/Logger/logger.js";

export const footerCheckpoint = async (req, res, next) => {
    try {
        const { tenantId, layout, blocks, bottomBar, status, userId } = req.body;
        if (!tenantId || !userId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Footer Creation Attempt by: ${userId}`)

        const newFooter = await Footer.create({
            tenantId,
            layout,
            blocks,
            bottomBar,
            status,
            publishedBy: userId,
            publishedAt: new Date(),

        });

        log.info(`Footer created by: ${userId} Date: ${newFooter.createdAt}`)

        res.status(200).json({
            message: "Footer created successfully by " + userId,
        })
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
}