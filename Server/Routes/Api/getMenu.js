import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification";
import { tenantVerification } from "../../Validation/middleware/tenantVerification";
import {getMenu} from "../../Api/getMenu.js";

const router = express.Router();

router.get(
    "/:domain/menu",
    tenantVerification,
    apiKeyVerification,
    getMenu
)

export default router;