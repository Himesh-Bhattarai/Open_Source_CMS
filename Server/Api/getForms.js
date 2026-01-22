import { Form } from "../Models/Form/Form.js";


export const getForm = async (req, res, next) => {
    try {
        const form = await Form.findOne({
            tenantId: req.tenant._id,
            status: "published"
        });

        if (!form) throw new Error("Form not found");
        res.json({
            form
        })

    } catch (err) {
        next(err)
    }
}