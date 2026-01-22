// routes/pageRoutes.js
import express from "express";
import { getPagesVerification, getPagesByIdVerification } from "../../Api/getPages.js";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
// import { featureCheck } from "../../Validation/middleware/featureCheck.js";


const router = express.Router();

router.get(
    "/:domain/pages",
    tenantVerification,
    apiKeyVerification,
    // featureCheck("pages"),
    getPagesVerification
);


router.get(
    "/domain/pages/:slug",
    tenantVerification,
    apiKeyVerification,
    getPagesByIdVerification
)

export default router;
