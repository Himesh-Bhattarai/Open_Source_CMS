import express from 'express';
import TenantRoute from '../Tenant.js';
import TenantUserRoute from '../TenantUser.js';

const router = express.Router();

router.use('/tenant', TenantRoute);
router.use('/tenant-user', TenantUserRoute);

export default router;