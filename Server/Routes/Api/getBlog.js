import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import { getBlog } from "../../Api/getBlog.js";
import { trackIntegrationUsage } from "../../Validation/middleware/trackIntegrationUsage.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/blog",
  tenantVerification,
  apiKeyVerification,
  trackIntegrationUsage({ featureKey: "blog" }),
  getBlog,
);

export default router;
