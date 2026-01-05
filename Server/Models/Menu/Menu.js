import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const MenuSchema = new Schema(
    {
        userId: {
            type: String,
            ref: "User",
            required: true,
        },

        tenantId: {
            type: String,
            ref: "Tenant",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        menuLocation: {
            type: String,
            enum: ["header", "sidebar"],
            required: true,
        },

        items: [
            {
                type: Schema.Types.ObjectId,
                ref: "MenuItem",
            },
        ],

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },

        publishedAt: Date,

        publishedBy: {
            type: String,
            ref: "User",
        },
    },
    {
        timestamps: true,
        collection: "menus",
    }
);

// ✅ FIXED INDEX
MenuSchema.index({ tenantId: 1, menuLocation: 1 });

export const Menu = models.Menu || model("Menu", MenuSchema);
