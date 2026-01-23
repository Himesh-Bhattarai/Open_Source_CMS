import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import {getFooter} from "../../Api/getFooter.js";

const router = express.Router({ mergeParams: true });

router.get(
    "/",
    tenantVerification,
    apiKeyVerification,
    getFooter
)

export default router;