// middleware/tenantVerification.js
import { Tenant } from "../../Models/Tenant/Tenant.js";

export const tenantVerification = async (req, res, next) => {
    try {
        console.log("Its is tenant verification place")
        const { domain } = req.params;
        console.log(domain)
        if (!domain) {
            return res.status(400).json({ error: "Domain is required" });
        }

        const tenant = await Tenant.findOne({
            domain: domain.toLowerCase(),
            status: "active",
        });

        console.log("Tenant found bro")

        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }

        req.tenant = tenant; // ✅ FULL tenant object
        next();
    } catch (err) {
        next(err);
    }
};
