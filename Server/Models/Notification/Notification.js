import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["CREATION", "UPDATE", "DELETION", "INFO"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    entity: { type: Object }, // store entity info like { type: "page", id: "123" }
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
