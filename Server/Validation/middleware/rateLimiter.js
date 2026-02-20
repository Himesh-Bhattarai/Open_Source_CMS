import { redis } from "./Infra/redis.js";
import crypto from "crypto";
import { ApiKey } from "../../Models/ApiKey/apiKey.js";

const DEFAULT_LIMIT = 500; // Max requests
const DEFAULT_WINDOW = 60; // Window in seconds

// This middleware combines API key verification and per-key rate limiting
// for external API traffic. Keep internal CMS routes on session auth middleware.


export const rateLimiter = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "API key missing" });
    }

    const rawKey = authHeader.replace("Bearer ", "").trim();
    const hash = crypto.createHash("sha256").update(rawKey).digest("hex");

    try {
        // Find the API key record to get a stable ID for Redis
        const apiKeyRecord = await ApiKey.findOne({ keyHash: hash });
        
        if (!apiKeyRecord) {
            return res.status(403).json({ error: "Invalid API key" });
        }

        const redisKey = `rate_limit:${apiKeyRecord._id}`;

        // Increment the counter and set expiry in one atomic operation (pipeline)
        const results = await redis.multi()
            .incr(redisKey)
            .expire(redisKey, DEFAULT_WINDOW) 
            .exec();

        const currentUsage = results[0][1];

        res.setHeader("X-RateLimit-Limit", DEFAULT_LIMIT);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, DEFAULT_LIMIT - currentUsage));

        if (currentUsage > DEFAULT_LIMIT) {
            return res.status(429).json({
                error: "Rate limit exceeded. Please try again later."
            });
        }
        next();
    } catch (e) {
        // If Redis fails, we usually allow the request to pass (fail-open) 
        // or log the error and next()
        console.error("Rate limiter Redis error:", e);
        next();
    }
}
