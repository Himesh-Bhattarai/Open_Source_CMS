import express from 'express';
import {menuItemCheckpoint} from "../../CheckPoint/Menu/MenuItem.js";
import {verificationMiddleware} from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.post("/",
    verificationMiddleware,
    menuItemCheckpoint
)

export default router
