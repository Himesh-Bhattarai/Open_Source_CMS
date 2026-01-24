import express from "express";
import { updatePagePhase2 } from "../../CheckPoint/Page/updatePage.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
const router = express.Router();

router.put("/:pageId", verificationMiddleware, updatePagePhase2);

export default router;
