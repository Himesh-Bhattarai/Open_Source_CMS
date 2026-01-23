import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import {getTheme} from "../../Api/getTheme.js";

const router = express.Router({ mergeParams: true });

router.get(
    "",
    tenantVerification,
    apiKeyVerification,
    getTheme
)

export default router;