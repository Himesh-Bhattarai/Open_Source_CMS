import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import { getFooter } from "../../Api/getFooter.js";
import { trackIntegrationUsage } from "../../Validation/middleware/trackIntegrationUsage.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  tenantVerification,
  apiKeyVerification,
  trackIntegrationUsage({ featureKey: "footer" }),
  getFooter,
);

export default router;
