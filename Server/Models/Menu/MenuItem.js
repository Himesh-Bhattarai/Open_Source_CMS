import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

// Menu Schema
export const MenuItemSchema = new Schema(
    {
        id: String,
        label: { type: String, required: true },
        type: { type: String, enum: ["internal", "external", "dropdown"], required: true },
        link: String,
        enabled: { type: Boolean, default: true },
        order: Number,
        children: [{ type: Schema.Types.Mixed }],
    },
    { _id: false },
)

export const MenuItem = models.MenuItem || model("MenuItem", MenuItemSchema)
