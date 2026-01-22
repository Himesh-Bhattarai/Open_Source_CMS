import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification";
import { tenantVerification } from "../../Validation/middleware/tenantVerification";
import {getMedia} from "../../Api/getMedia.js";

const router = express.Router();

router.get(
    "/:domain/media",
    tenantVerification,
    apiKeyVerification,
    getMedia
)

export default router;