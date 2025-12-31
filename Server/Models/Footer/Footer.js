import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import { FooterBlockSchema } from "./FooterBlock.js"

const FooterSchema = new Schema(
    {
        tenantId: { type: String,  ref: "Tenant" },
        layout: { type: String, enum: ["2-column", "3-column", "4-column", "custom"] },
        blocks: [FooterBlockSchema],
        bottomBar: {
            copyright: String,
            socialLinks: [{ platform: String, url: String, icon: String }],
        },
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        publishedAt: Date,
        publishedBy: { type: String, ref: "User" },
    },
    {
        timestamps: true,
        collection: "footers",
    },
)

FooterSchema.index({ tenantId: 1 })

export const Footer = models.Footer || model("Footer", FooterSchema)