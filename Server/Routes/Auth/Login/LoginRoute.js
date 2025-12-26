import express from "express";
import { LoginController } from "../../../../Controllers/Auth/LoginController.js";
import { validateLogin } from "../../../Validation/Client/User.js";

const router = express.Router();

router.post("/login",
    validateLogin,
    LoginController
)