import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const FormSchema = new Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: { type: String },
    description: String,

    status: {
      type: String,
      default: "draft",
    },

    scope: {
      type: String,
      default: "global",
    },

    submitButtonText: String,
    successMessage: String,

    behavior: {
      storeSubmissions: Boolean,
      notifyEmail: String,
      redirectUrl: String,
    },

    fields: {
      type: Array,
      default: [],
    },

    metadata: {
      version: Number,
    },

    createdBy: {
      type: String, // userId
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "forms",
  },
);

export const Form = models.Form || model("Form", FormSchema);
