import { Schema } from "mongoose"

export const FooterBlockSchema = new Schema(
    {
        id: String,
        type: { type: String, enum: ["text", "menu", "logo", "social", "newsletter", "html"], required: true },
        order: Number,
        column: Number,
        data: Schema.Types.Mixed,
    },
    { _id: false },
)

export const FooterBlock = models.FooterBlock || model("FooterBlock", FooterBlockSchema)    