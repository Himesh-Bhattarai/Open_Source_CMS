import { Theme } from "../../Models/Theme/Theme.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

export const themeCheckpoint = async (req, res, next) => {
  try {
    // userId comes from auth middleware
    const userId = req.user?.userId;
    const { websiteId, theme } = req.body;

    // tenantId = websiteId (for now)
    const tenantId = websiteId;

    if (!userId || !tenantId) {
      const err = new Error("Missing required authentication context");
      err.statusCode = 401;
      throw err;
    }

    if (!theme || !theme.name) {
      const err = new Error("Invalid theme payload");
      err.statusCode = 400;
      throw err;
    }

    log.info(
      `Theme upsert attempt | user=${userId} | tenant=${tenantId} | theme=${theme.name}`,
    );

    const updatedTheme = await Theme.findOneAndUpdate(
      {
        tenantId,
        "metadata.scope": "global",
      },
      {
        tenantId,
        name: theme.name,
        colors: theme.colors,
        typography: theme.typography,
        layout: theme.layout,
        metadata: {
          scope: "global",
          version: (theme.metadata?.version || 0) + 1,
          lastUpdated: new Date(),
        },
        createdBy: userId,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    log.info(
      `Theme saved | tenant=${tenantId} | version=${updatedTheme.metadata.version}`,
    );

    res.status(200).json({
      message: "Global theme saved successfully",
      data: {
        tenantId,
        themeId: updatedTheme._id,
        version: updatedTheme.metadata.version,
      },
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
