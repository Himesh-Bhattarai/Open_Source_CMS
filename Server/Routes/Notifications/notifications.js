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
router.post("/read/:notificationId", verificationMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { notificationId } = req.params;
        if (!userId) throw new Error("Unauthorized");

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        );

        if (!notification) throw new Error("Notification not found");

        res.json({ ok: true, notification });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// Mark all notifications as read
router.post("/read-all", verificationMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) throw new Error("Unauthorized");

        await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
        res.json({ ok: true, message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// Delete notification
router.delete("/:notificationId", verificationMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { notificationId } = req.params;
        if (!userId) throw new Error("Unauthorized");

        const deleted = await Notification.findOneAndDelete({ _id: notificationId, userId });
        if (!deleted) throw new Error("Notification not found");

        res.json({ ok: true, message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

export default router;
