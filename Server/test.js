import crypto from "crypto";

const raw = "7e6f2b9d8c3a41b2a5f1d9e0c4b8a6f3e2d1c0b9a8f7e6d5c4b3a2910fedcba";

const hash = crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex");

console.log(hash);
