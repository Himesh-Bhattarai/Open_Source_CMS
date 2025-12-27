import express from 'express';
import { validateTenantUser } from '../../../Validation/Tenant/TenantUser.js';
import { TenantUserCheckpoint } from '../../../CheckPoint/Tenant/TenantUser.js';

const router = express.Router();

router.post("/tenant-user",
    validateTenantUser,
    TenantUserCheckpoint
)

export default router;