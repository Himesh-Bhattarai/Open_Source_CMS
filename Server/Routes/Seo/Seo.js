import express from "express";
import {seoCheckpoint} from "../../CheckPoint/Seo/Seo.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { updateSeoCheckpoint } from "../../CheckPoint/Seo/updateSeo.js";

const router = express.Router();

router.post("/seo",
    verificationMiddleware,
    seoCheckpoint
);

router.put("/seo/:seoId",
    verificationMiddleware,
    updateSeoCheckpoint
)


export default router