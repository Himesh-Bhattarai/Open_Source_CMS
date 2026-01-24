import express from "express";
import { pageCheckpoint } from "../../CheckPoint/Page/Page.js";
import { validatePage } from "../../Validation/Page/Page.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.post("/", validatePage, verificationMiddleware, pageCheckpoint);

export default router;
