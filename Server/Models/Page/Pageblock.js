import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
export const PageBlockSchema = new Schema(
  {
    pageId: String,
    type: {
      type: String,
      enum: [
        "hero",
        "text",
        "features",
        "gallery",
        "cta",
        "testimonials",
        "team",
        "contact",
        "custom",
      ],
      required: true,
    },
    order: Number,
    data: Schema.Types.Mixed,
  },
  { _id: false },
);

export const PageBlock =
  models.PageBlock || model("PageBlock", PageBlockSchema);
