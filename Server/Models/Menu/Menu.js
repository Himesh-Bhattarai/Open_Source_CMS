import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

// Menu item schema (flexible)
const MenuItemSchema = new Schema(
  {
    label: String,
    type: String,
    link: String,
    enabled: Boolean,
    order: Number,
    children: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: true },
);

// Main menu schema
const MenuSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    tenantId: { type: String, ref: "Tenant", required: true },

    title: String,
    description: String,
    menuLocation: { type: String, enum: ["header", "footer", "sidebar"] },
    navbarType: {
      type: String,
      enum: ["static", "dropdown", "mega", "breadcrumb"],
      default: "static",
    },

    items: { type: [MenuItemSchema], default: [] },

    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: Date,
    publishedBy: { type: String, ref: "User" },
  },
  { timestamps: true, collection: "menus" },
);

MenuSchema.index({ tenantId: 1, menuLocation: 1 });

export const Menu = models.Menu || model("Menu", MenuSchema);
