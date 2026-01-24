import express from "express";
import { validateTenant } from "../../Validation/Tenant/Tenant.js";
import { tenantCheckpoint } from "../../CheckPoint/Tenant/Tenant.js";

const router = express.Router();

router.post("/tenant", validateTenant, tenantCheckpoint);

export default router;
