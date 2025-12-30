import express from "express";
import { logoutCheckpoint } from "../../../CheckPoint/Auth/Logout/Logout.js";

const router = express.Router();

router.post("/", logoutCheckpoint);

export default router;