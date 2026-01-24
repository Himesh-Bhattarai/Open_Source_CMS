import { FooterBlock } from "../../Models/Footer/FooterBlock.js";

import { logger as log } from "../../Utils/Logger/logger.js";

export const footerBlockCheckpoint = (req, res, next) => {
  try {
    const { userId, type, order, column, data } = req.body;

    if (!userId || !type || !order || !column || !data) {
      const err = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }

    log.info(`Footer Block Creation Attempt by: ${userId}`);

    const footerBlock = FooterBlock.create({
      _id: userId,
      type,
      order,
      column,
      data,
    });

    log.info(
      `Footer Block created by: ${userId} Date: ${footerBlock.createdAt}`,
    );

    res.status(200).json({
      message: "Footer Block created successfully by " + userId,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
