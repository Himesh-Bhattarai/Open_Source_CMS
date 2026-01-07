import express from "express";
import {seoCheckpoint} from "../../CheckPoint/Seo/Seo.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.post("/seo",
    verificationMiddleware,
    seoCheckpoint
);


export default router