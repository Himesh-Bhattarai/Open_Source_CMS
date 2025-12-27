import express from 'express';
import { validateTenant } from '../../Validation/Tenant/Tenant.js';
import { TenantCheckpoint } from '../../../CheckPoint/Tenant/Tenant.js';

const router = express.Router();

router.post("/tenant",
    validateTenant,
    TenantCheckpoint
)

export default router;