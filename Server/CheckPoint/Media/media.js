import { Media } from "../../Models/Media/Media";
import { logger as log } from "../../Utils/Logger/logger.js";

export const mediaCheckpoint = async (req, res, next) => {
    try {
        const { userId, tenantId, filename, originalName, mimeType, size, width, height, url, altText, folder } = req.body;

        if (!userId, tenantId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Media Creation Attempt by: ${userId}`)
        const user_name = await User.findOne({ userId }).select('name');

        const media = Media.create({
            _id: userId,
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
            uploadedBy: user_name
        });

        log.info(`Media created by: ${userId} Date: ${media.createdAt}`)
        res.status(200).json({
            message: "Media created successfully by " + userId,
        })
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }

}