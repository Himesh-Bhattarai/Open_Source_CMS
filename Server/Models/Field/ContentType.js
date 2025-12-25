
const ContentTypeSchema = new Schema(
    {
        _id: { type: String, required: true },
        tenantId: { type: String, required: true, ref: "Tenant" },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        fields: [FieldSchema],
        icon: String,
        description: String,
        isSystem: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: "content_types",
    },
)

ContentTypeSchema.index({ tenantId: 1, slug: 1 }, { unique: true })

export const ContentType = models.ContentType || model("ContentType", ContentTypeSchema)
