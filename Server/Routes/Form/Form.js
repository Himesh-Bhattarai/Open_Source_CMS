import express from "express";
const router = express.Router();
import {formCheckpoint} from "../../CheckPoint/Form/Form.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
//import validate later
router.post("/form",
    verificationMiddleware,
    formCheckpoint
);

export default router