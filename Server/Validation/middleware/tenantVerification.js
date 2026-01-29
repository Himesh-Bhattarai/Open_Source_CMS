// middleware/tenantVerification.js
import { Tenant } from "../../Models/Tenant/Tenant.js";

export const tenantVerification = async (req, res, next) => {
  try {
    const domain = req.domain;

    if (!domain) {
      return res.status(400).json({ error: "Domain is required" });
    }

    const tenant = await Tenant.findOne({
      domain: domain,
      status: "active",
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    req.tenant = tenant;
    next();
  } catch (err) {
    next(err);
  }
};
