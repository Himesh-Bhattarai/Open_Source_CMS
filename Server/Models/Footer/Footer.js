import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const FooterSchema = new Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
    },

    layout: {
      type: String,
      enum: ["2-column", "3-column", "4-column", "custom"],
      default: "4-column",
    },

    blocks: [
      {
        id: { type: String, required: true },

        type: {
          type: String,
          enum: ["text", "menu", "logo", "social", "newsletter", "html"],
          required: true,
        },

        data: Schema.Types.Mixed, // frontend-driven CMS block data
      },
    ],

    bottomBar: {
      copyrightText: String,

      socialLinks: [
        {
          id: String,
          platform: String,
          url: String,
          icon: String,
          label: String,
          slug: String,
        },
      ],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: Date,
    publishedBy: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "footers",
  },
);

export const Footer = models.Footer || model("Footer", FooterSchema);
