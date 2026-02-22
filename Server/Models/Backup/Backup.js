import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const BackupIncludeSchema = new Schema(
  {
    pages: { type: Boolean, default: true },
    media: { type: Boolean, default: true },
    settings: { type: Boolean, default: true },
    database: { type: Boolean, default: true },
  },
  { _id: false },
);

const BackupRecordSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    tenantId: { type: String, default: null, index: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["manual", "scheduled", "automatic"],
      default: "manual",
      index: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "annually", null],
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "failed", "restored"],
      default: "completed",
      index: true,
    },
    sizeBytes: { type: Number, default: 0 },
    includes: BackupIncludeSchema,
    runAt: { type: Date, default: Date.now, index: true },
    completedAt: { type: Date, default: null },
    metadata: {
      description: { type: String, default: "" },
      strategy: { type: String, enum: ["full", "incremental"], default: "full" },
      validate: { type: Boolean, default: false },
      triggeredBy: { type: String, default: "user" },
      source: { type: String, default: "cms-ui" },
    },
    snapshot: {
      pagesCount: { type: Number, default: 0 },
      mediaCount: { type: Number, default: 0 },
      settingsCount: { type: Number, default: 0 },
      databaseCount: { type: Number, default: 0 },
    },
    archive: {
      type: Schema.Types.Mixed,
      default: {},
    },
    delivery: {
      annualEmailSentAt: { type: Date, default: null },
      annualEmailTo: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    collection: "backup_records",
  },
);

const BackupPolicySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    tenantId: { type: String, default: null, index: true },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "annually"],
      required: true,
      index: true,
    },
    enabled: { type: Boolean, default: true, index: true },
    retentionDays: { type: Number, default: 30 },
    includes: BackupIncludeSchema,
    timezone: { type: String, default: "UTC" },
    nextRunAt: { type: Date, required: true, index: true },
    lastRunAt: { type: Date, default: null },
    annualEmailDelivery: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "backup_policies",
  },
);

BackupPolicySchema.index({ userId: 1, tenantId: 1, frequency: 1 }, { unique: true });

export const BackupRecord = models.BackupRecord || model("BackupRecord", BackupRecordSchema);
export const BackupPolicy = models.BackupPolicy || model("BackupPolicy", BackupPolicySchema);
