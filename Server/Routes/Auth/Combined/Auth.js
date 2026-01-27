import express from "express";
import LoginRoute from "../Login/LoginRoute.js";
import LogoutRoute from "../Logout/Logout.js";
import RegisterRoute from "../Register/Register.js";
import { verificationMiddleware } from "../../../Utils/Jwt/Jwt.js";
import { verifyMe } from "../../../Validation/middleware/verifyMe.js";

const router = express.Router();

router.use("/login", LoginRoute);
router.use("/logout", LogoutRoute);
router.use("/register", RegisterRoute);
//protected
router.get("/profile", verificationMiddleware,
  
    verifyMe);

export default router;
