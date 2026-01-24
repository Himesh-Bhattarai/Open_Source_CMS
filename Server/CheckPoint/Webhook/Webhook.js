import { Webhook } from "../../Models/Webhook/Webhooks.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const webhookCheckpoint = async (req, res, next) => {
  try {
    const { userId, tenantId, url, events, secret, failureCount } = req.body;
    if (!userId || !tenantId) {
      const err = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }

    log.info(`Webhook Creation Attempt by: ${userId}`);

    const webhook = await Webhook.create({
      _id: userId,
      tenantId,
      url,
      events,
      secret,
      status,
      failureCount,
      lastTriggered: Date.now(),
    });

    log.info(`Webhook created by: ${userId} Date: ${webhook.createdAt}`);

    res.status(200).json({
      message: "Webhook created successfully by " + userId,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
