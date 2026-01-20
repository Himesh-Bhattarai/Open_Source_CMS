// middleware/tenantVerification.js
import { Tenant } from "../../Models/Tenant/Tenant.js";

export const tenantVerification = async (req, res, next) => {
    try {
        const { domain } = req.params;
        if (!domain) {
            return res.status(400).json({ error: "Domain is required" });
        }

        const tenant = await Tenant.findOne({
            domain: domain.toLowerCase(),
            status: "active",
        });

        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }

        req.tenant = tenant; // ✅ FULL tenant object
        next();
    } catch (err) {
        next(err);
    }
};
