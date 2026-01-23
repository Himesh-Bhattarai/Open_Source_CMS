import express from "express";
import { apiKeyVerification } from "../../Validation/middleware/apiKeyVerification.js";
import { tenantVerification } from "../../Validation/middleware/tenantVerification.js";
import {getBlog} from "../../Api/getBlog.js";

const router = express.Router({ mergeParams: true });

router.get(
    "/blog",
    async(req, res, next)=>{
        const domain = req.params.domain;
        console.log("Domain", domain);
        next();
    },
    tenantVerification,
    apiKeyVerification,
    getBlog
)

export default router;