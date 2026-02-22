import mongoose from "mongoose";
const { Schema } = mongoose;

export const FooterBlockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "menu", "logo", "social", "newsletter", "html"],
      required: true,
    },
    order: { type: Number, default: 0 },
    column: { type: Number, default: 0 },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

export const FooterBlock = mongoose.model("FooterBlock", FooterBlockSchema);
