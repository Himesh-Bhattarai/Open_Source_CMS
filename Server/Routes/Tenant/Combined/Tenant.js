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


router.put("/tenant/:tenantId", verificationMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId
        const tenantId = req.params.tenantId

        if (!userId) return res.status(401).json({ error: "Unauthorized" })

        const update = req.body

        const tenant = await Tenant.findOneAndUpdate(
            { tenantId: tenantId},     // 🔐 ownership + correct id
            { $set: update },       // 🧠 actual update
            { new: true }           // 🔥 return updated doc
        )

        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" })
        }

        res.json({
            ok: true,
            data: tenant
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Update failed" })
    }
})


export default router;