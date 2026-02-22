import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const IntegrationUsageSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    featureKey: {
      type: String,
      enum: ["menu", "footer", "blog", "pages", "seo", "theme", "media", "form"],
      required: true,
    },

    endpointKey: {
      type: String,
      enum: ["default", "external", "public"],
      required: true,
      default: "default",
    },

    lastCalledAt: {
      type: Date,
      default: null,
    },

    totalCalls: {
      type: Number,
      default: 0,
    },

    lastStatusCode: Number,
  },
  { timestamps: true },
);

// prevent duplicates
IntegrationUsageSchema.index({ tenantId: 1, featureKey: 1, endpointKey: 1 }, { unique: true });

export const IntegrationUsage =
  models.IntegrationUsage || model("IntegrationUsage", IntegrationUsageSchema);
