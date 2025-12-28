import { Schema, model, models } from "mongoose"

const PageBlockSchema = new Schema(
    {
        id: String,
        type: {
            type: String,
            enum: ["hero", "text", "features", "gallery", "cta", "testimonials", "team", "contact", "custom"],
            required: true,
        },
        order: Number,
        data: Schema.Types.Mixed,
    },
    { _id: false },
)

export const PageBlock = models.PageBlock || model("PageBlock", PageBlockSchema)