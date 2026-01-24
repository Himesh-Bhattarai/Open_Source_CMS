import express from "express";
import { pageBlockCheckpoint } from "../../CheckPoint/Page/PageBlock.js";
import { validatePage } from "../../Validation/Page/Page.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.post("/", validatePage, verificationMiddleware, pageBlockCheckpoint);

export default router;
