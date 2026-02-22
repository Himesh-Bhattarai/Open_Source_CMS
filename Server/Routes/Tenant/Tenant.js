import express from "express";
import { validateTenant } from "../../Validation/Tenant/Tenant.js";
import { tenantCheckpoint } from "../../CheckPoint/Tenant/Tenant.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.post("/tenant", verificationMiddleware, validateTenant, tenantCheckpoint);

export default router;
