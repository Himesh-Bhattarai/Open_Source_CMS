// routes/pageRoutes.js
import express from "express";
import { getPagesVerification } from "../../Api/getPages.js";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import { featureCheck } from "../../Validation/middleware/featureCheck.js";

const router = express.Router();

router.get(
    "/:domain/pages",
    tenantVerification,
    apiKeyVerification,
    featureCheck("pages"),
    getPagesVerification
);

export default router;
