import express from "express";
import { validateTenantUser } from "../../Validation/Tenant/TenantUser.js";
import { tenantUserCheckpoint } from "../../CheckPoint/Tenant/TenantUser.js";

const router = express.Router();

router.post("/tenant-user", validateTenantUser, tenantUserCheckpoint);

export default router;
