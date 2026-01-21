// middleware/apiKeyVerification.js
import { ApiKey } from "../../Models/ApiKey/apiKey.js";

export const apiKeyVerification = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ error: "API key missing" });
        }

        const rawKey = authHeader.replace("Bearer ", "");

        const apiKeyRecord = await ApiKey.findOne({
            tenantId: req.tenant._id,
            isActive: true,
        });

        if (!apiKeyRecord || !apiKeyRecord.validateKey(rawKey)) {
            return res.status(403).json({ error: "Invalid API key" });
        }

        req.apiKey = apiKeyRecord;
        next();
    } catch (err) {
        next(err);
    }
};
