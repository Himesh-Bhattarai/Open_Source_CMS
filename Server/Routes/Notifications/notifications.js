import express from "express";
import  Notification  from "../../Models/Notification/Notification.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

// Get all notifications for a user
router.get("/get-notification", verificationMiddleware,
     async (req, res) => {
    try {
        const userId = req.user?.userId;
        if(!userId) throw new Error("Unauthorized");
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.json({ ok: true, notifications });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// Mark notification as read
router.post("/read/:notificationId", async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!notification) throw new Error("Notification not found");

        res.json({ ok: true, notification });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

export default router;
