import {themeCheckpoint} from "../../../CheckPoint/Theme/Theme.js";
import {validateTheme} from "../../../Validation/Theme/Theme.js";
import express from "express";

const router = express.Router();

router.post("/theme",
    validateTheme,
    themeCheckpoint
)

export default router