import crypto from "crypto";
import { ApiKey } from "../../Models/ApiKey/apiKey.js";

export const apiKeyVerification = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Ask for Api verification");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ error: "API key missing" });
        }

        const rawKey = authHeader.replace("Bearer ", "").trim();
        console.log("Finding Api Key");

        const apiKeyRecord = await ApiKey.findOne({
            tenantId: req.tenant._id.toString(),
            isActive: true,
        });

        
        if (!apiKeyRecord) {
            return res.status(403).json({ error: "Invalid API key. Please contact support" });
        }

        const hash = crypto
            .createHash("sha256")
            .update(rawKey)
            .digest("hex");

        if (apiKeyRecord.keyHash !== hash) {
            return res.status(403).json({ error: "Invalid API key" });
        }

        req.apiKey = apiKeyRecord;
        next();
    } catch (err) {
        next(err);
    }
};
