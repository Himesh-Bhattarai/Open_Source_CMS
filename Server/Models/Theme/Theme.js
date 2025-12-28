import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const ThemeSchema = new Schema(
    {
        _id: { type: String, required: true },
        tenantId: { type: String, required: true, ref: "Tenant" },
        name: String,
        colors: {
            primary: String,
            secondary: String,
            background: String,
            text: String,
            accent: String,
        },
        typography: {
            bodyFont: String,
            headingFont: String,
            fontSize: String,
        },
        layout: {
            containerWidth: String,
            spacing: String,
            borderRadius: String,
        },
        header: {
            style: { type: String, enum: ["fixed", "sticky", "standard"] },
            variant: { type: String, enum: ["centered", "left", "split"] },
        },
        footer: {
            variant: { type: String, enum: ["multi-column", "minimal", "centered"] },
        },
        customCss: String,
    },
    {
        timestamps: true,
        collection: "themes",
    },
)

ThemeSchema.index({ tenantId: 1 })

export const Theme = models.Theme || model("Theme", ThemeSchema)