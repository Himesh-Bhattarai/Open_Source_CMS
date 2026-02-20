import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import { getBlog } from "../../Api/getBlog.js";
import { trackIntegrationUsage } from "../../Validation/middleware/trackIntegrationUsage.js";
const router = express.Router({ mergeParams: true });

router.get(
  "/",
  tenantVerification,
  apiKeyVerification,
  trackIntegrationUsage({ featureKey: "blog", endpointKey: "collection" }),
  getBlog,
);

router.get(
  "/:slug",
  tenantVerification,
  apiKeyVerification,
  trackIntegrationUsage({ featureKey: "blog", endpointKey: "detail" }),
  getBlog,
);

export default router;
