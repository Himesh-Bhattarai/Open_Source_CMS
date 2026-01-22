import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification";
import { tenantVerification } from "../../Validation/middleware/tenantVerification";
import {getFooter} from "../../Api/getFooter.js";

const router = express.Router();

router.get(
    "/:domain/footer",
    tenantVerification,
    apiKeyVerification,
    getFooter
)

export default router;