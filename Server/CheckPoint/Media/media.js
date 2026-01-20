import { Media } from "../../Models/Media/Media.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const mediaCheckpoint = async (req, res, next) => {
    try {
        const {
            tenantId,
            filename,
            originalName,
            mimeType,
            size,
            width,
            height,
            url,
            altText,
            folder,
        } = req.body;

        const userId = req.user?.userId;

        if (!userId || !tenantId || !filename) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        const media = await Media.create({
            userId,
            tenantId,
            filename,
            originalName,
            mimeType,
            size,
            width,
            height,
            url,
            altText,
            folder,
            uploadedBy: userId,
        });

        res.status(201).json({
            ok: true,
            data: media,
        });
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
};
