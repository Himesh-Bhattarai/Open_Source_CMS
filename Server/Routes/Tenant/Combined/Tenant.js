import express from 'express';
import TenantRoute from '../Tenant.js';
import TenantUserRoute from '../TenantUser.js';

const router = express.Router();

router.use('/', TenantRoute);
router.use('/', TenantUserRoute);

export default router;