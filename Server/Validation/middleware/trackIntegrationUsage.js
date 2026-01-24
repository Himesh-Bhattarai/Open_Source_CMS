import { IntegrationUsage } from "../../Models/Integration/IntegrationUsage.js";

// factory to attach featureKey + endpointKey to middleware
export const trackIntegrationUsage = ({
  featureKey,
  endpointKey = "external",
}) => {
  return (req, res, next) => {
    res.on("finish", async () => {
      try {
        // Only track successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          await IntegrationUsage.updateOne(
            {
              tenantId: req.tenant._id,
              featureKey,
              endpointKey,
            },
            {
              $set: {
                lastCalledAt: new Date(),
                lastStatusCode: res.statusCode,
              },
              $inc: { totalCalls: 1 },
            },
            { upsert: true },
          );
        }
      } catch (err) {
        console.error("Integration tracking failed", err);
      }
    });

    next();
  };
};
