import express from "express";
import { logoutCheckpoint } from "../../../../Controllers/Auth/Logout.js";

const router = express.Router();

router.post("/logout", logoutCheckpoint);

export default router;