import express from 'express';
import {validateVersion} from "../../Validation/Version/Version.js";
import {versionCheckpoint} from "../../CheckPoint/Version/Version.js";

const router = express.Router();

router.post("/version",
    validateVersion,
    versionCheckpoint
)

export default router