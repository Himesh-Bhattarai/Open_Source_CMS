import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import {getMenu} from "../../Api/getMenu.js";

const router = express.Router({ mergeParams: true });

router.get(
    "/",
    tenantVerification,
    apiKeyVerification,
    getMenu
)

export default router;