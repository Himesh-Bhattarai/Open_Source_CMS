import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification";
import { tenantVerification } from "../../Validation/middleware/tenantVerification";
import {getBlog} from "../../Api/getBlog.js";

const router = express.Router();

router.get(
    "/:domain/blog",
    tenantVerification,
    apiKeyVerification,
    getBlog
)

export default router;