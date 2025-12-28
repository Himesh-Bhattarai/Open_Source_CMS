import { logger as log } from "../../Utils/Logger/logger.js";
import { Tenant } from "../../Models/Tenant/Tenant.js";
import { ActivityLog } from "../../Models/ActivityLog/ActivityLog.js";

export const ActivityLogCheckpoint = async (req, res, next) => {
    try {
        const { action, entityType, entityId, details, ipAddress, userAgent } = req.body;
        if (!action || !entityType || !entityId) throw new Error("Missing required fields");

        const userId = req.user.userId;
        const tenantId = await Tenant.findOne({ userId }).select('tenantId');

        if (!tenantId) throw new Error("Tenant not found");

        const activityLog = await ActivityLog.create({
            tenantId: tenantId.tenantId,
            userId: userId,
            action: action,
            entityType: entityType,
            entityId: entityId,
            details: details,
            ipAddress: ipAddress,
            userAgent: userAgent,
        });

        log.info(`Activity Log created by: ${userId} action: ${action} entityType: ${entityType} entityId: ${entityId}`);
        next();

        res.status(200).json({
            message: "Activity Log created successfully by " + userId
        })
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);

    }
}