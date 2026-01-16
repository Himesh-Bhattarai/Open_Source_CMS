import { Footer } from "../../Models/Footer/Footer.js";

export const footerCheckpoint = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { tenantId, metadata, ...payload } = req.body;

        if (!userId || !tenantId) {
            return res.status(400).json({
                message: "userId and tenantId are required",
            });
        }

        const footer = await Footer.create({
            ...payload,
            tenantId,
            userId : userId,
            status: metadata?.status ?? "draft",
            publishedBy: userId,
            publishedAt: new Date(),
        });

        res.status(201).json({
            success: true,
            footer,
        });
    } catch (err) {
        next(err);
    }
};
