import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification";
import { tenantVerification } from "../../Validation/middleware/tenantVerification";
import {getForm} from "../../Api/getForm.js";

const router = express.Router();

router.get(
    "/:domain/form",
    tenantVerification,
    apiKeyVerification,
    getForm
)

export default router;