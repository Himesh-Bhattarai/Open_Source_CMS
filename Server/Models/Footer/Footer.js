import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const FooterSchema = new Schema(
    {
        tenantId: { type: String, required: true },
        websiteId: { type: String, required: true },

        layout: {
            type: String,
            enum: ["2-column", "3-column", "4-column", "custom"],
            default: "4-column",
        },

        blocks: [
            {
                id: String,
                type: {
                    type: String,
                    enum: ["text", "menu", "logo", "social", "newsletter", "html"],
                    required: true,
                },
                order: Number,
                column: Number,
                data: Schema.Types.Mixed,
            },
        ],

        bottomBar: {
            copyrightText: String,
            socialLinks: [
                {
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
        publishedBy: { type: String, ref: "User" },
    },
    {
        timestamps: true,
        collection: "footers",
    }
);

FooterSchema.index({ tenantId: 1, websiteId: 1 });

export const Footer = models.Footer || model("Footer", FooterSchema);
