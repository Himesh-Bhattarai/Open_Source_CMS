import { logger as log } from "../../../Utils/Logger/logger.js";
import { Tenant } from "../../../Models/Tenant/Tenant.js";

export const TenantUser = async (req, res, next) => {
    try {
        const { userId, role } = req.body

        if (!userId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        };

        log.info(`Tenant User Attempt to create new user by: ${userId}`);


        const tenantId = await Tenant.findOne({ userId }).select('tenantId name')


        if (!tenantId) {
            const err = new Error("Tenant not found");
            err.statusCode = 400;
            throw err;
        }

        const newTenantUser = await TenantUser.create({
            tenantId: tenantId.tenantId,
            userId: userId,
            role: role,
            invitedBy: tenantId.name,
            invitedAt: new Date(),
        })

        res.status(200).json({ message: "Tenant User created successfully" });

    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err)
    }

}

