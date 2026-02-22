import { Footer } from "../../Models/Footer/Footer.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";

export const footerCheckpoint = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { tenantId, metadata, ...payload } = req.body;

    if (!userId || !tenantId) {
      return res.status(400).json({
        message: "userId and tenantId are required",
      });
    }

    const nextStatus = metadata?.status === "published" ? "published" : "draft";

    const footer = await Footer.create({
      ...payload,
      tenantId,
      userId: userId,
      status: nextStatus,
      publishedBy: nextStatus === "published" ? userId : null,
      publishedAt: nextStatus === "published" ? new Date() : null,
    });

    notif.createFooter({
      userId,
      footerName: payload.name,
      footerId: footer._id,
      websiteId: tenantId,
    });

    res.status(201).json({
      success: true,
      footer,
    });
  } catch (err) {
    next(err);
  }
};
