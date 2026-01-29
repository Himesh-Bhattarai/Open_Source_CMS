import { Seo } from "../../Models/Seo/Seo.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

export const updateSeoCheckpoint = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { seoId } = req.params;
    const payload = req.body;

    if (!userId) throw new Error("Unauthorized");
    if (!seoId) throw new Error("SEO id is required");
    if (!payload) throw new Error("Payload is required");

    // 1️⃣ Load existing SEO (to know scope)
    const existingSeo = await Seo.findOne({ _id: seoId, userId });
    if (!existingSeo) throw new Error("SEO not found");

    const update = {
      meta: {
        ...existingSeo.meta,
        timestamp: new Date(),
      },
    };

    // 2️⃣ Apply updates based on scope
    if (existingSeo.scope === "global" && payload.globalSEO) {
      update.globalSEO = payload.globalSEO;
    }

    if (existingSeo.scope === "page" && payload.pageSEO) {
      update.pageSEO = payload.pageSEO;
    }

    // 3️⃣ Update document
    const updatedSeo = await Seo.findOneAndUpdate(
      { _id: seoId, userId },
      { $set: update },
      { new: true },
    );

    notif.updateSEO({ userId, websiteName: payload.websiteName, seoId, websiteId: payload.websiteId });

    return res.status(200).json({
      success: true,
      data: updatedSeo,
    });
  } catch (err) {
    console.error("Update SEO failed:", err.message);
    next(err);
  }
};
