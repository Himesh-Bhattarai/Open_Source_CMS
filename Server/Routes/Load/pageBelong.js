import express from "express";
import { Page } from "../../Models/Page/Page.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.get(
  "/website/:tenantId",
  verificationMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      const tenantId = req.params.tenantId;

      if (!userId) throw new Error("Forbidden");
      if (!tenantId) throw new Error("Missing required fields");

      const getTenantPages = await Page.find({ tenantId: tenantId });
      if (!getTenantPages) throw new Error("page not found");
      return res.status(200).json({ pages: getTenantPages });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
