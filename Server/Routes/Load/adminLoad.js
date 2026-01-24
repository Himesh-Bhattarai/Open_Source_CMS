import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { User } from "../../Models/Client/User.js";
import express from "express";

const router = express.Router();

router.get("/get-all-users",
    verificationMiddleware,
    async (req, res, next) => {
        try {
            const userId = req.user?.useId;
            if (!userId) throw new Error("Unauthorized");
            const user = await User.findOne({ _id: userId, role: "admin" });
            if (!user) throw new Error("Unauthorized");

            if (user.role !== "admin") throw new Error("Unauthorized");

            res.status(200).json({ data: user })
        } catch (err) {
            err.statusCode = err.statusCode || 400;
            next(err);
        }
    }

)

export default router;