import express from 'express';

import { RegisterController } from '../../../../Controllers/Auth/RegisterController.js';
import { validateRegister } from '../../../Validation/Client/User.js';

const router = express.Router();

router.post("/register",
    validateRegister,
    RegisterController
)