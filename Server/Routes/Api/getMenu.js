import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import { getMenu } from "../../Api/getMenu.js";
import { trackIntegrationUsage } from "../../Validation/middleware/trackIntegrationUsage.js";
const router = express.Router({ mergeParams: true });

router.get(
  "/",
  tenantVerification,
  apiKeyVerification,
  trackIntegrationUsage({ featureKey: "menu" }),
  getMenu,
);

export default router;
