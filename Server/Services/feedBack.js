import { FeedBack } from "../Models/Feedback/Feedback.js";
import { User } from "../Models/Client/User.js";
import express from "express";
import { verificationMiddleware } from "../Utils/Jwt/Jwt.js";

const router = express.Router();

router.post("/user/collect",
    verificationMiddleware,
    async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            const data = req.body;
            if (!data || Object.keys(data).length === 0) throw new Error("feedback is required");
            if (!userId) throw new Error('Unauthorized');

            const user = await User.findOne({
                _id: userId
            });
            if (!user) throw new Error("User not found");

            const userName = user.name;

            const feedBack = await FeedBack.create({
                name: userName, message: data, email: user.email
            });

            return res.status(200).json({
                ok: true,
                status: 200,
                data: feedBack
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;