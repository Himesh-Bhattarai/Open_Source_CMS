import crypto from "crypto";
import { ApiKey } from "../../Models/ApiKey/apiKey.js";

const extractApiKey = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }
  const xApiKey = req.headers["x-api-key"];
  if (typeof xApiKey === "string" && xApiKey.trim()) {
    return xApiKey.trim();
  }
  return "";
};

export const apiKeyVerification = async (req, res, next) => {
  try {
    const rawKey = extractApiKey(req);
    if (!rawKey) {
      return res.status(403).json({ error: "API key missing" });
    }

    const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const apiKeyRecord = await ApiKey.findOne({
      tenantId: req.tenant._id.toString(),
      keyHash: hash,
      isActive: true,
    });

    if (!apiKeyRecord) {
      return res
        .status(403)
        .json({ error: "Invalid API key. Please contact support" });
    }

    req.apiKey = apiKeyRecord;
    next();
  } catch (err) {
    next(err);
  }
};
