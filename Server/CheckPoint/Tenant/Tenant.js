import crypto from "crypto";
import { Tenant } from "../../Models/Tenant/Tenant.js";
import { ApiKey } from "../../Models/ApiKey/apiKey.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";

const normalizeDomain = (value = "") => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const normalizeName = (value = "") => {
  const trimmed = String(value || "").trim();
  return trimmed || `Website ${Date.now().toString().slice(-4)}`;
};

const buildAutoDomain = (name = "") => {
  const base = normalizeDomain(name) || "website";
  return `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const tenantCheckpoint = async (req, res, next) => {
  try {
    const authUserId = req.user?.userId;
    const { name, domain, ownerEmail, status, plan, settings, subdomain, createdBy } =
      req.body || {};
    const resolvedUserId = authUserId || createdBy;

    if (!resolvedUserId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const safeName = normalizeName(name);
    const requestedDomain = normalizeDomain(domain);
    const safeOwnerEmail = String(ownerEmail || "").trim();
    let safeDomain = requestedDomain || buildAutoDomain(safeName);

    log.info(`Tenant creation attempt by user=${resolvedUserId}, name=${safeName}`);

    const existingByDomain = await Tenant.findOne({
      domain: new RegExp(`^${safeDomain}$`, "i"),
    }).lean();

    if (requestedDomain && existingByDomain) {
      const err = new Error("Domain is already in use");
      err.statusCode = 409;
      throw err;
    }

    while (!requestedDomain) {
      const taken = await Tenant.findOne({
        domain: new RegExp(`^${safeDomain}$`, "i"),
      }).lean();
      if (!taken) break;
      safeDomain = buildAutoDomain(`${safeName}-${Date.now()}`);
    }

    const tenant = await Tenant.create({
      userId: String(resolvedUserId),
      name: safeName,
      domain: safeDomain,
      subdomain: subdomain ? String(subdomain).trim() : "",
      ownerEmail: safeOwnerEmail,
      status: status || "active",
      plan: plan || "free",
      settings: settings || {},
    });

    const rawApiKey = crypto.randomBytes(32).toString("hex");
    const keyHash = crypto.createHash("sha256").update(rawApiKey).digest("hex");
    const keyPreview = `${rawApiKey.slice(0, 4)}...${rawApiKey.slice(-4)}`;

    try {
      await ApiKey.create({
        userId: String(resolvedUserId),
        tenantId: tenant._id.toString(),
        keyHash,
        keyPreview,
        permissions: ["read:pages"],
        isActive: true,
        name: "Default Public Key",
      });
    } catch (apiErr) {
      await Tenant.findByIdAndDelete(tenant._id);
      throw apiErr;
    }

    log.info(`Tenant created successfully: ${safeName}`);

    notif.createWebsite({
      userId: String(resolvedUserId),
      domain: safeDomain,
      name: safeName,
      websiteId: tenant._id,
    });

    return res.status(201).json({
      ok: true,
      message: "Tenant created successfully",
      apiKey: rawApiKey,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        domain: tenant.domain,
      },
    });
  } catch (err) {
    if (err?.code === 11000) {
      err.statusCode = 409;
      err.message = "Domain is already in use";
    }
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
