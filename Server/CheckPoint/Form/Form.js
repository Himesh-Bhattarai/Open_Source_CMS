import { Form } from "../../Models/Form/Form.js";
export const formCheckpoint = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { tenantId, ...form } = req.body;

        if (!userId) throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
        if (!tenantId) throw Object.assign(new Error("TenantId is required"), { statusCode: 400 });

        const createdForm = await Form.create({
            tenantId,
            userId : userId,
            createdBy: userId,
            ...form,
        });

        return res.status(201).json({
            message: "Form created successfully",
            formId: createdForm._id,
        });
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
};
