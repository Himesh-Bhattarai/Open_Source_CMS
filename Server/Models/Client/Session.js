import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

export const SessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        refreshToken: {
            type: String,
            required: true,
            unique: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        expiresAt: {
            type: String,
            default: "7d",
            index: true
        },

        logoutAt: {
            type: Date,
            default: null
        },

        ipAddress: String,
        userAgent: String
    },
    {
        timestamps: true,
        collection: "sessions"
    }
);

export const Session =
    models.Session || model("Session", SessionSchema);
