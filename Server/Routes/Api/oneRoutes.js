import express from "express";
import getBlog from "./getBlog.js";
import getPages from "./getPages.js";
import getMenu from "./getMenu.js";
import getFooter from "./getFooter.js";
import getSeo from "./getSeo.js";
import getTheme from "./getTheme.js";
import getMedia from "./getMedia.js";
import getForm from "./getForm.js";

const router = express.Router();

//Routes Blog Related
router.use("/blog", getBlog);
router.use("/blogs", getBlog);
// router.use("/:domain/blog");
//Router Page Related
router.use("/pages", getPages);
// router.use("/:domain/pages/:slug", getSinglePages);
//Router Menu Related
router.use("/menu", getMenu);
//Router Footer Related
router.use("/footer", getFooter);
//Router Seo Related
router.use("/seo", getSeo);
// router.use("/:domain/seo");
//Router Theme Related
router.use("/theme", getTheme);
//Router Media Related
router.use("/media", getMedia);
//Router Form Related
router.use("/form", getForm);

export default router;
