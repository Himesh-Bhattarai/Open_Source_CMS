import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { updateMenuCheckpoint } from "../../CheckPoint/Menu/UpdateMenu.js";

const router = express.Router();

router.put("/:menuId",
    verificationMiddleware,
    updateMenuCheckpoint
);

export default router;