// controllers/getPages.js
import { Page } from "../Models/Page/Page.js";

export const getPagesVerification = async (req, res, next) => {
    try {
        const pages = await Page.find({
            tenantId: req.tenant._id,
            status: "published",
        })
            .select("title slug settings")
            .sort({ createdAt: -1 });

        res.json({ pages });
    } catch (err) {
        next(err);
    }
};
