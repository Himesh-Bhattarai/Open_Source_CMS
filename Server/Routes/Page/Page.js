import express from "express";
import { pageCheckpoint } from "../../CheckPoint/Page/Page.js";
import { validatePage } from "../../Validation/Page/Page.js";

const router = express.Router();

router.post("/page",
    validatePage,
    pageCheckpoint
)

export default router