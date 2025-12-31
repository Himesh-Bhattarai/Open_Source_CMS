import express from 'express';
import TenantRoute from '../Tenant.js';
import TenantUserRoute from '../TenantUser.js';
import { verificationMiddleware } from '../../../Utils/Jwt/Jwt.js';
import { Tenant } from '../../../Models/Tenant/Tenant.js';

const router = express.Router();

router.use('/', TenantRoute);
router.use('/', TenantUserRoute);

router.get('/get-tenant', verificationMiddleware, async (req, res)=>{
    const userId = req.user?.userId;
    if(!userId) return res.status(401).json({message: "Forbidden"});

    const tenants = await Tenant.find({userId}).lean();
    
    return res.status(200).json({tenants});
})

export default router;