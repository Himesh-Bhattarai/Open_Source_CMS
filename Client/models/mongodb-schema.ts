// import { Schema, model, models } from "mongoose"

// // Tenant Schema
// const TenantSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     name: { type: String, required: true },
//     domain: { type: String, required: true, unique: true },
//     subdomain: String,
//     apiKey: { type: String, required: true, unique: true },
//     ownerEmail: { type: String, required: true },
//     status: { type: String, enum: ["active", "suspended", "inactive"], default: "active" },
//     plan: { type: String, enum: ["free", "starter", "pro", "enterprise"], default: "free" },
//     settings: {
//       siteName: String,
//       timezone: String,
//       language: String,
//       dateFormat: String,
//     },
//   },
//   {
//     timestamps: true,
//     collection: "tenants",
//   },
// )

// TenantSchema.index({ domain: 1 })
// TenantSchema.index({ apiKey: 1 })

// export const Tenant = models.Tenant || model("Tenant", TenantSchema)

// // User Schema
// const UserSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     passwordHash: { type: String, required: true },
//     name: { type: String, required: true },
//     avatar: String,
//     role: { type: String, enum: ["admin", "owner", "manager", "editor", "viewer"], default: "viewer" },
//     status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
//     lastLogin: Date,
//     twoFactorEnabled: { type: Boolean, default: false },
//   },
//   {
//     timestamps: true,
//     collection: "users",
//   },
// )

// UserSchema.index({ email: 1 })

// export const User = models.User || model("User", UserSchema)

// // Tenant Users (Relationship)
// const TenantUserSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     userId: { type: String, required: true, ref: "User" },
//     role: { type: String, enum: ["owner", "manager", "editor", "viewer"], required: true },
//     invitedBy: { type: String, ref: "User" },
//     invitedAt: { type: Date, default: Date.now },
//     acceptedAt: Date,
//   },
//   {
//     timestamps: true,
//     collection: "tenant_users",
//   },
// )

// TenantUserSchema.index({ tenantId: 1, userId: 1 }, { unique: true })
// TenantUserSchema.index({ tenantId: 1 })

// export const TenantUser = models.TenantUser || model("TenantUser", TenantUserSchema)

// // Menu Schema
// const MenuItemSchema = new Schema(
//   {
//     id: String,
//     label: { type: String, required: true },
//     type: { type: String, enum: ["internal", "external", "dropdown"], required: true },
//     link: String,
//     enabled: { type: Boolean, default: true },
//     order: Number,
//     children: [{ type: Schema.Types.Mixed }],
//   },
//   { _id: false },
// )

// const MenuSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     name: { type: String, required: true },
//     location: { type: String, enum: ["header", "footer", "mobile", "sidebar"] },
//     items: [MenuItemSchema],
//     status: { type: String, enum: ["draft", "published"], default: "draft" },
//     publishedAt: Date,
//     publishedBy: { type: String, ref: "User" },
//   },
//   {
//     timestamps: true,
//     collection: "menus",
//   },
// )

// MenuSchema.index({ tenantId: 1, location: 1 })

// export const Menu = models.Menu || model("Menu", MenuSchema)

// // Footer Schema
// const FooterBlockSchema = new Schema(
//   {
//     id: String,
//     type: { type: String, enum: ["text", "menu", "logo", "social", "newsletter", "html"], required: true },
//     order: Number,
//     column: Number,
//     data: Schema.Types.Mixed,
//   },
//   { _id: false },
// )

// const FooterSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     layout: { type: String, enum: ["2-column", "3-column", "4-column", "custom"] },
//     blocks: [FooterBlockSchema],
//     bottomBar: {
//       copyright: String,
//       socialLinks: [{ platform: String, url: String, icon: String }],
//     },
//     status: { type: String, enum: ["draft", "published"], default: "draft" },
//     publishedAt: Date,
//     publishedBy: { type: String, ref: "User" },
//   },
//   {
//     timestamps: true,
//     collection: "footers",
//   },
// )

// FooterSchema.index({ tenantId: 1 })

// export const Footer = models.Footer || model("Footer", FooterSchema)

// // Page Schema
// const PageBlockSchema = new Schema(
//   {
//     id: String,
//     type: {
//       type: String,
//       enum: ["hero", "text", "features", "gallery", "cta", "testimonials", "team", "contact", "custom"],
//       required: true,
//     },
//     order: Number,
//     data: Schema.Types.Mixed,
//   },
//   { _id: false },
// )

// const PageSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     title: { type: String, required: true },
//     slug: { type: String, required: true },
//     blocks: [PageBlockSchema],
//     seo: {
//       metaTitle: String,
//       metaDescription: String,
//       keywords: [String],
//       ogImage: String,
//       noIndex: { type: Boolean, default: false },
//     },
//     status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
//     publishedAt: Date,
//     publishedBy: { type: String, ref: "User" },
//     authorId: { type: String, ref: "User" },
//   },
//   {
//     timestamps: true,
//     collection: "pages",
//   },
// )

// PageSchema.index({ tenantId: 1, slug: 1 }, { unique: true })
// PageSchema.index({ tenantId: 1, status: 1 })

// export const Page = models.Page || model("Page", PageSchema)

// // Blog Post Schema
// const BlogPostSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     title: { type: String, required: true },
//     slug: { type: String, required: true },
//     content: { type: String, required: true },
//     excerpt: String,
//     featuredImage: String,
//     authorId: { type: String, ref: "User" },
//     categoryId: { type: String, ref: "BlogCategory" },
//     tags: [String],
//     seo: {
//       metaTitle: String,
//       metaDescription: String,
//       keywords: [String],
//       ogImage: String,
//     },
//     status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
//     publishedAt: Date,
//     scheduledAt: Date,
//     views: { type: Number, default: 0 },
//   },
//   {
//     timestamps: true,
//     collection: "blog_posts",
//   },
// )

// BlogPostSchema.index({ tenantId: 1, slug: 1 }, { unique: true })
// BlogPostSchema.index({ tenantId: 1, status: 1 })
// BlogPostSchema.index({ tenantId: 1, publishedAt: -1 })

// export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema)

// // Blog Category Schema
// const BlogCategorySchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     name: { type: String, required: true },
//     slug: { type: String, required: true },
//     description: String,
//     postCount: { type: Number, default: 0 },
//   },
//   {
//     timestamps: true,
//     collection: "blog_categories",
//   },
// )

// BlogCategorySchema.index({ tenantId: 1, slug: 1 }, { unique: true })

// export const BlogCategory = models.BlogCategory || model("BlogCategory", BlogCategorySchema)

// // Media Schema
// const MediaSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     filename: { type: String, required: true },
//     originalName: { type: String, required: true },
//     mimeType: { type: String, required: true },
//     size: { type: Number, required: true },
//     width: Number,
//     height: Number,
//     url: { type: String, required: true },
//     altText: String,
//     folder: String,
//     uploadedBy: { type: String, ref: "User" },
//   },
//   {
//     timestamps: true,
//     collection: "media",
//   },
// )

// MediaSchema.index({ tenantId: 1 })
// MediaSchema.index({ tenantId: 1, folder: 1 })

// export const Media = models.Media || model("Media", MediaSchema)

// // Theme Schema
// const ThemeSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     name: String,
//     colors: {
//       primary: String,
//       secondary: String,
//       background: String,
//       text: String,
//       accent: String,
//     },
//     typography: {
//       bodyFont: String,
//       headingFont: String,
//       fontSize: String,
//     },
//     layout: {
//       containerWidth: String,
//       spacing: String,
//       borderRadius: String,
//     },
//     header: {
//       style: { type: String, enum: ["fixed", "sticky", "standard"] },
//       variant: { type: String, enum: ["centered", "left", "split"] },
//     },
//     footer: {
//       variant: { type: String, enum: ["multi-column", "minimal", "centered"] },
//     },
//     customCss: String,
//   },
//   {
//     timestamps: true,
//     collection: "themes",
//   },
// )

// ThemeSchema.index({ tenantId: 1 })

// export const Theme = models.Theme || model("Theme", ThemeSchema)

// // Content Type Schema
// const FieldSchema = new Schema(
//   {
//     id: String,
//     name: String,
//     type: {
//       type: String,
//       enum: ["text", "textarea", "richtext", "number", "date", "boolean", "image", "file", "select", "relation"],
//     },
//     required: Boolean,
//     order: Number,
//     options: Schema.Types.Mixed,
//   },
//   { _id: false },
// )

// const ContentTypeSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     name: { type: String, required: true },
//     slug: { type: String, required: true },
//     fields: [FieldSchema],
//     icon: String,
//     description: String,
//     isSystem: { type: Boolean, default: false },
//   },
//   {
//     timestamps: true,
//     collection: "content_types",
//   },
// )

// ContentTypeSchema.index({ tenantId: 1, slug: 1 }, { unique: true })

// export const ContentType = models.ContentType || model("ContentType", ContentTypeSchema)

// // Collection Schema (Dynamic Content)
// const CollectionSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     contentTypeId: { type: String, required: true, ref: "ContentType" },
//     data: { type: Schema.Types.Mixed, required: true },
//     status: { type: String, enum: ["draft", "published"], default: "draft" },
//     publishedAt: Date,
//     authorId: { type: String, ref: "User" },
//   },
//   {
//     timestamps: true,
//     collection: "collections",
//   },
// )

// CollectionSchema.index({ tenantId: 1, contentTypeId: 1 })
// CollectionSchema.index({ tenantId: 1, status: 1 })

// export const Collection = models.Collection || model("Collection", CollectionSchema)

// // Activity Log Schema
// const ActivityLogSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     userId: { type: String, ref: "User" },
//     action: {
//       type: String,
//       enum: ["create", "update", "delete", "publish", "unpublish", "login", "logout"],
//       required: true,
//     },
//     entityType: {
//       type: String,
//       enum: ["page", "blog", "menu", "footer", "media", "user", "theme", "collection"],
//       required: true,
//     },
//     entityId: String,
//     details: Schema.Types.Mixed,
//     ipAddress: String,
//     userAgent: String,
//   },
//   {
//     timestamps: { createdAt: true, updatedAt: false },
//     collection: "activity_logs",
//   },
// )

// ActivityLogSchema.index({ tenantId: 1, createdAt: -1 })
// ActivityLogSchema.index({ entityType: 1, entityId: 1 })

// export const ActivityLog = models.ActivityLog || model("ActivityLog", ActivityLogSchema)

// // Version History Schema
// const VersionSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     entityType: { type: String, required: true },
//     entityId: { type: String, required: true },
//     data: { type: Schema.Types.Mixed, required: true },
//     createdBy: { type: String, ref: "User" },
//   },
//   {
//     timestamps: { createdAt: true, updatedAt: false },
//     collection: "versions",
//   },
// )

// VersionSchema.index({ entityType: 1, entityId: 1, createdAt: -1 })

// export const Version = models.Version || model("Version", VersionSchema)

// // Webhook Schema
// const WebhookSchema = new Schema(
//   {
//     _id: { type: String, required: true },
//     tenantId: { type: String, required: true, ref: "Tenant" },
//     url: { type: String, required: true },
//     events: [
//       {
//         type: String,
//         enum: [
//           "page.created",
//           "page.updated",
//           "page.published",
//           "blog.created",
//           "blog.updated",
//           "blog.published",
//           "menu.updated",
//           "footer.updated",
//         ],
//       },
//     ],
//     secret: String,
//     status: { type: String, enum: ["active", "inactive"], default: "active" },
//     lastTriggered: Date,
//     failureCount: { type: Number, default: 0 },
//   },
//   {
//     timestamps: true,
//     collection: "webhooks",
//   },
// )

// WebhookSchema.index({ tenantId: 1 })

// export const Webhook = models.Webhook || model("Webhook", WebhookSchema)
