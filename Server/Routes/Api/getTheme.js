import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification";
import { tenantVerification } from "../../Validation/middleware/tenantVerification";
import {getTheme} from "../../Api/getTheme.js";

const router = express.Router();

router.get(
    "/:domain/theme",
    tenantVerification,
    apiKeyVerification,
    getTheme
)

export default router;