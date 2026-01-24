import { themeCheckpoint } from "../../CheckPoint/Theme/Theme.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import express from "express";

const router = express.Router();

router.post("/theme", verificationMiddleware, themeCheckpoint);

export default router;
