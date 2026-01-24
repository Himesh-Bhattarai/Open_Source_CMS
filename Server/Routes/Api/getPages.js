// routes/pageRoutes.js
import express from "express";
import { getPagesVerification, getPagesByIdVerification } from "../../Api/getPages.js";
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
    trackIntegrationUsage({ featureKey: "page" }),
    getPagesVerification
);


router.get(
    "/domain/pages/:slug",
    tenantVerification,
    apiKeyVerification,
    trackIntegrationUsage({ featureKey: "page" }),
    getPagesByIdVerification
)

export default router;
