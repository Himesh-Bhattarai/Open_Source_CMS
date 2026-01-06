import { Footer } from "../../Models/Footer/Footer.js";

export const footerCheckpoint = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { tenantId, websiteId, ...payload } = req.body;

        if (!userId || !tenantId || !websiteId) {
            return res.status(400).json({
                message: "userId, tenantId and websiteId are required",
            });
        }

        const footer = await Footer.findOneAndUpdate(
            { tenantId, websiteId },
            {
                ...payload,
                tenantId,
                websiteId,
                publishedBy: userId,
                publishedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            footer,
        });
    } catch (err) {
        next(err);
    }
};
