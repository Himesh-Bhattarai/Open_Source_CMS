import { Version } from "../../Models/Version/Version.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const versionCheckpoint = (req, res, next) => {
  try {
    const { userId, tenantId, entityType, entityId, data } = req.body;
    if (!userId || !tenantId) {
      const err = new Error("Missing userId or tenantId");
      err.statusCode = 400;
      throw err;
    }

    log.info(`Version Creation Attempt by: ${userId}`);

    const newVersion = Version.create({
      _id: userId,
      tenantId,
      entityType,
      entityId,
      data,
      createdBy: userId,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
