
import Page from "./Page.js";
import express from "express";
import updatePage from "./updatePage.js";
const router = express.Router();

router.use("/page", Page);
router.use("/page", updatePage);

export default router;
