import express from "express";
import { footerBlockCheckpoint } from "../../CheckPoint/Footer/FooterBlock.js";
const router = express.Router();

router.post("/", footerBlockCheckpoint);

export default router;
