import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const MenuItemSchema = new Schema(
    {
        userId: { type: String, ref: "User", required: true },
        menuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },

        label: { type: String, required: true },

        type: {
            type: String,
            enum: ["internal", "external", "dropdown"],
            required: true,
        },

        link: String,

        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 },

        parentId: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            default: null,
        },

        children: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
    },
    { timestamps: true }
);

export const MenuItem =
    models.MenuItem || model("MenuItem", MenuItemSchema);
