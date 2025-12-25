
// Content Type Schema
const FieldSchema = new Schema(
    {
        id: String,
        name: String,
        type: {
            type: String,
            enum: ["text", "textarea", "richtext", "number", "date", "boolean", "image", "file", "select", "relation"],
        },
        required: Boolean,
        order: Number,
        options: Schema.Types.Mixed,
    },
    { _id: false },
)
