import { Tenant } from "../../Models/Tenant/Tenant.js";
import { logger as log } from "../../Utils/Logger/logger.js"

export const tenantCheckpoint = async (req, res, next) => {
    try {
        const { name, domain, apiKey, ownerEmail, status, plan, settings, subdomain } = req.body;

        if (!name || !domain || !subdomain || !apiKey || !ownerEmail || !status || !plan || !settings) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Tenant Creation Attempt by: ${ownerEmail} name: ${name}`)

        //check if tenant already exist
        const isTenantExist = await Tenant.findOne({ domain });

        //if tenant already exist
        if (isTenantExist) {
            const err = new Error("Tenant already exist");
            err.statusCode = 400;
            throw err;
        }


        //create one
        const tenant = await Tenant.create({
            name,
            domain,
            subdomain,
            apiKey,
            ownerEmail,
            status,
            plan,
            settings
        })

        log.info(`Tenant Created by: ${ownerEmail} name: ${name}`)

        res.status(200).json({
            message: "Tenant created successfully",

        })


    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);

    }
}