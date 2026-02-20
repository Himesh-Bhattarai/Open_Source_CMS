import express from "express";
import  Notification  from "../../Models/Notification/Notification.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all notifications for a user
router.get("/get-notification", verificationMiddleware,
     async (req, res) => {
    try {
        const userId = req.user?.userId;
        if(!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ ok: true, notifications });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// Mark notification as read
router.post("/read/:notificationId", verificationMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { notificationId } = req.params;
        if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
          return res.status(400).json({ ok: false, message: "Invalid notification id" });
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        );

        if (!notification) return res.status(404).json({ ok: false, message: "Notification not found" });

        res.status(200).json({ ok: true, notification });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// Mark all notifications as read
router.post("/read-all", verificationMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

        await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
        res.status(200).json({ ok: true, message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// Delete notification
router.delete("/:notificationId", verificationMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { notificationId } = req.params;
        if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
          return res.status(400).json({ ok: false, message: "Invalid notification id" });
        }

        const deleted = await Notification.findOneAndDelete({ _id: notificationId, userId });
        if (!deleted) return res.status(404).json({ ok: false, message: "Notification not found" });

        res.status(200).json({ ok: true, message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

export default router;
