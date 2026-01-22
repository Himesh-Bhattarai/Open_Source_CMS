import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification";
import { tenantVerification } from "../../Validation/middleware/tenantVerification";
import {getSeo} from "../../Api/getSeo.js";

const router = express.Router();

router.get(
    "/:domain/seo",
    tenantVerification,
    apiKeyVerification,
    getSeo
)

export default router;