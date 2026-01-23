import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import {getMedia} from "../../Api/getMedia.js";

const router = express.Router({ mergeParams: true });

router.get(
    "/:",
    tenantVerification,
    apiKeyVerification,
    getMedia
)

export default router;