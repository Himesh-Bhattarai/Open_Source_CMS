import { ContentType } from "../../../Models/Field/ContentType.js";
import {cmsEventService as notif} from "../../../Services/notificationServices.js"
import { logger as log } from "../../../Utils/Logger/logger.js";

export const contentTypeCheckpoint = async (req, res, next) => {
  try {
    const {
      tenantId,
      userId,
      name,
      slug,
      fields,
      icon,
      description,
      isSystem,
    } = req.body;
    if (
      !tenantId ||
      !userId ||
      !name ||
      !slug ||
      !fields ||
      !description ||
      !isSystem
    ) {
      const err = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }

    log.info(`Content Type Creation Attempt by: ${userId} name: ${name}`);

    const contentType = await ContentType.create({
      tenantId,
      _id: userId,
      name,
      slug,
      fields,
      icon,
      description,
      isSystem,
    });

    log.info(
      `Content Type created by: ${userId} name: ${name} Date: ${contentType.createdAt}`,
    );

    res.status(200).json({
      message: "Content Type created successfully by " + userId,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
    if (err.message === "Tenant not found") {
      const err = new Error("Tenant not found");
      err.statusCode = 400;
      throw err;
    }
  }
};
