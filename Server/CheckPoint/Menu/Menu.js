import { Menu } from "../../Models/Menu/Menu.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";

export const menuCheckpoint = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const {
      title,
      description,
      menuLocation,
      navbarType,
      status,
      publishedAt,
      publishedBy,
      tenantId,
    } = req.body;

    if (!userId || !title || !menuLocation) {
      const err = new Error("Missing required fields: userId, title, or menuLocation");
      err.statusCode = 400;
      throw err;
    }

    log.info(`Menu creation attempt by user: ${userId}`);

    const nextStatus = status === "published" ? "published" : "draft";
    const nextPublishedAt = nextStatus === "published" ? publishedAt || new Date() : null;
    const nextPublishedBy = nextStatus === "published" ? publishedBy || userId : null;

    const newMenu = await Menu.create({
      userId,
      tenantId,
      title,
      description,
      menuLocation,
      navbarType,
      status: nextStatus,
      publishedAt: nextPublishedAt,
      publishedBy: nextPublishedBy,
      items: [],
    });

    log.info(`Menu created successfully: ${newMenu._id}`);

    notif.createMenu({
      userId,
      menuName: title,
      menuId: newMenu._id,
      websiteId: tenantId,
    });

    res.status(201).json({
      success: true,
      menuId: newMenu._id,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
