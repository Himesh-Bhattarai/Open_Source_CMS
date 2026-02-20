import { User } from "../Models/Client/User.js";
import bcrypt from "bcrypt";
import express from "express";
import { verificationMiddleware } from "../Utils/Jwt/Jwt.js";

const router = express.Router();

router.post("/user-payload",
    verificationMiddleware,

    async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            const par1 = req.body.par1;
            const par2 = req.body.par2;
            if (!userId) throw new Error("Unauthorized");
            if (!par1 || !par2) throw new Error("Missing parameters");

            //find user
            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("User not found");

            // Verify email (par1) matches and password (par2) is correct
            const isEmailValid = user.email === par1;
            const isPasswordValid = await bcrypt.compare(par2, user.passwordHash);

            if (!isEmailValid || !isPasswordValid) {
                return res.status(401).json({ ok: false, message: "Invalid credentials" });
            }

            res.status(200).json({
                ok: true,
                message: "User validated successfully",
                shouting: "Kill it"
            });

        } catch (err) {
            next(err);
        }
    }
)

export default router;
