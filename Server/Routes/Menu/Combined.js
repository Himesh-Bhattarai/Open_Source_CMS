import express from "express";

import MenuRoute from "./Menu.js";
import updateRoute from "./UpdateMenu.js";
const router = express.Router();

router.use("/menu", MenuRoute);
router.use("/menus", updateRoute);

export default router;
