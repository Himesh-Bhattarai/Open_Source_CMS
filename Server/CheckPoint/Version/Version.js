import { Version } from "../../Models/Version/Version.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import crypto from "crypto";

export const versionCheckpoint = async (req, res, next) => {
  try {
    const { userId, createdBy, tenantId, entityType, entityId, data } = req.body;
    const actorId = createdBy || userId;

    if (!actorId || !tenantId || !entityType || !entityId) {
      const err = new Error("Missing required version fields");
      err.statusCode = 400;
      throw err;
    }

    log.info(`Version Creation Attempt by: ${actorId}`);

    const newVersion = await Version.create({
      _id: crypto.randomUUID(),
      tenantId,
      entityType,
      entityId,
      data,
      createdBy: actorId,
    });

    return res.status(201).json({
      ok: true,
      message: "Version created successfully",
      data: newVersion,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
