import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const WebhookSchema = new Schema(
    {
        _id: { type: String, required: true },
        tenantId: { type: String, required: true, ref: "Tenant" },
        url: { type: String, required: true },
        events: [
            {
                type: String,
                enum: [
                    "page.created",
                    "page.updated",
                    "page.published",
                    "blog.created",
                    "blog.updated",
                    "blog.published",
                    "menu.updated",
                    "footer.updated",
                ],
            },
        ],
        secret: String,
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        lastTriggered: Date,
        failureCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        collection: "webhooks",
    },
)

WebhookSchema.index({ tenantId: 1 })

export const Webhook = models.Webhook || model("Webhook", WebhookSchema)
