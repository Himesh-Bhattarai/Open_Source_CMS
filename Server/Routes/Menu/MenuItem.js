import express from 'express';
import {menuItemCheckpoint} from "../../CheckPoint/Menu/MenuItem.js";
import {validateMenuItem} from "../../Validation/Menu/MenuItem.js";
import {verificationMiddleware} from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.post("/",
    validateMenuItem,
    verificationMiddleware,
    menuItemCheckpoint
)

export default router
