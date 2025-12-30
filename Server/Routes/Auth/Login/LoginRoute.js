import express from "express";
import { loginCheckpoint } from "../../../CheckPoint/Auth/Login/Login.js";
import { validateLogin } from "../../../Validation/Client/User.js";

const router = express.Router();

router.post("/",
    validateLogin,
    loginCheckpoint
)

export default router;