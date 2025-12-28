import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

export const SessionSchema = new Schema(
    {
        userId: { type: String, required: true, ref: "User" },
        token: { type: String, required: true },
        createdAt: { type: Date, required: true },
        expiresAt: { type: Date, required: true },
    },
    {
        timestamps: true,
        collection: "sessions",
    },
)

export const Session = models.Session || model("Session", SessionSchema)