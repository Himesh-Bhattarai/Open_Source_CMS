import { logger as log } from "../../Utils/Logger/logger.js";
import { Form } from "../../Models/Form/Form.js";

export const formCheckpoint = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { tenantId, form } = req.body;

        // ONLY REQUIRED CHECKS
        if (!userId) {
            const err = new Error("Unauthorized");
            err.statusCode = 401;
            throw err;
        }

        if (!tenantId) {
            const err = new Error("TenantId is required");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Form creation started | user=${userId} tenant=${tenantId}`);

        // CREATE FORM (NO PAYLOAD VALIDATION)
        const createdForm = await Form.create({
            tenantId,
            createdBy: userId,
            ...form,
        });

        log.info(
            `Form created | id=${createdForm._id} user=${userId} tenant=${tenantId}`
        );

        return res.status(201).json({
            message: "Form created successfully",
            formId: createdForm._id,
        });
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
};
