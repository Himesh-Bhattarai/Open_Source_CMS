// middleware/tenantVerification.js
import { Tenant } from "../../Models/Tenant/Tenant.js";

export const tenantVerification = async (req, res, next) => {
  try {
    console.log("Its is tenant verification place");
    console.log("domain from req.domain:", req.domain);
    console.log("params:", req.params);

    const domain = req.domain;
    console.log("Domain", domain);


    if (!domain) {
      return res.status(400).json({ error: "Domain is required" });
    }

    const tenant = await Tenant.findOne({
      domain: domain,
      status: "active",
    });

    console.log("Tenant found bro");

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    req.tenant = tenant;
    console.log("Tenant found", tenant._id);
    next();
  } catch (err) {
    next(err);
  }
};
