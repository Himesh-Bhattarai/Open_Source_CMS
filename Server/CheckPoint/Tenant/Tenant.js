import crypto from "crypto";
import { Tenant } from "../../Models/Tenant/Tenant.js";
import { ApiKey } from "../../Models/ApiKey/apiKey.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

export const tenantCheckpoint = async (req, res, next) => {
  try {
    const {
      name,
      domain,
      ownerEmail,
      status,
      plan,
      settings,
      subdomain,
      createdBy,
    } = req.body;

    if (!name || !domain || !ownerEmail) {
      const err = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }

    log.info(`Tenant creation attempt by ${ownerEmail}, name: ${name}`);

    const isTenantExist = await Tenant.findOne({ domain });
    if (isTenantExist) {
      const err = new Error("Tenant already exists");
      err.statusCode = 400;
      throw err;
    }

    // 1️⃣ Create tenant
    const tenant = await Tenant.create({
      userId: createdBy,
      name,
      domain,
      subdomain,
      ownerEmail,
      status,
      plan,
      settings,
    });

    // 2️⃣ Generate raw API key
    const rawApiKey = crypto.randomBytes(32).toString("hex");


    // 3️⃣ Hash API key
    const keyHash = crypto.createHash("sha256").update(rawApiKey).digest("hex");

    // 4️⃣ Store hash only
    await ApiKey.create({
      tenantId: tenant._id.toString(),
      keyHash,
      permissions: ["read:pages"],
      name: "Default Public Key",
    });

    log.info(`Tenant created successfully: ${name}`);

    notif.createWebsite({ userId: createdBy, domain, name, websiteId: tenant._id });

    // 5️⃣ Return RAW key once
    res.status(201).json({
      message: "Tenant created successfully",
      apiKey: rawApiKey,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        domain: tenant.domain,
      },
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
