import express from "express";
import { pageBlockCheckpoint } from "../../CheckPoint/Page/PageBlock.js";
import { validatePage } from "../../Validation/Page/PageBlock.js";

const router = express.Router();

router.post("/page-block",
    validatePage,
    pageCheckpoint
)

export default router