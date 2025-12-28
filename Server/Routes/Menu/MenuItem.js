import express from 'express';
import {menuItemCheckpoint} from "../../CheckPoint/Menu/MenuItem.js";
import {validateMenuItem} from "../../Validation/Menu/MenuItem.js";

const router = express.Router();

router.post("/menu-item",
    validateMenuItem,
    menuItemCheckpoint
)

export default router
