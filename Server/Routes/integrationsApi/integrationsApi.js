import express from 'express';
import { integrationsApi } from '../../CheckPoint/Integrations/integrationsApi.js';
import {verificationMiddleware} from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.get("/get-api",
    verificationMiddleware,
    integrationsApi
)

export default router