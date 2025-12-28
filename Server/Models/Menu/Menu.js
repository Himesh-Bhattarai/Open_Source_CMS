import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import {MenuItemSchema} from "./MenuItem.js"


const MenuSchema = new Schema(
    {
        _id: { type: String, required: true },
        tenantId: { type: String, required: true, ref: "Tenant" },
        name: { type: String, required: true },
        location: { type: String, enum: ["header", "footer", "mobile", "sidebar"] },
        items: [MenuItemSchema],
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        publishedAt: Date,
        publishedBy: { type: String, ref: "User" },
    },
    {
        timestamps: true,
        collection: "menus",
    },
)

MenuSchema.index({ tenantId: 1, location: 1 })

export const Menu = models.Menu || model("Menu", MenuSchema)