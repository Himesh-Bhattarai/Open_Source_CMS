import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
// Content Type Schema
export const FieldSchema = new Schema(
  {
    id: String,
    name: String,
    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "richtext",
        "number",
        "date",
        "boolean",
        "image",
        "file",
        "select",
        "relation",
      ],
    },
    required: Boolean,
    order: Number,
    options: Schema.Types.Mixed,
  },
  { _id: false },
);

export const Field = models.Field || model("Field", FieldSchema);
