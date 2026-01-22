import { Theme } from "../Models/Theme/Theme.js";


export const getTheme = async (req, res, next) => {
    try {
        const theme = await Theme.findOne({
            tenantId: req.tenant._id,
            status: "published"
        });

        if (!theme) throw new Error("theme not found");
        res.json({
            theme
        })

    } catch (err) {
        next(err)
    }
}