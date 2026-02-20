// routes/pageRoutes.js
import express from "express";
import {
  getPagesVerification,
  getPagesByIdVerification,
} from "../../Api/getPages.js";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
// import { featureCheck } from "../../Validation/middleware/featureCheck.js";

import { trackIntegrationUsage } from "../../Validation/middleware/trackIntegrationUsage.js";
const router = express.Router({ mergeParams: true });

router.get(
  "/",
  tenantVerification,
  apiKeyVerification,
  // featureCheck("pages"),
  trackIntegrationUsage({ featureKey: "page", endpointKey: "collection" }),
  getPagesVerification,
);

router.get(
  "/:slug",
  tenantVerification,
  apiKeyVerification,
  trackIntegrationUsage({ featureKey: "page", endpointKey: "detail" }),
  getPagesByIdVerification,
);

export default router;
