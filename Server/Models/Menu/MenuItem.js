
// Menu Schema
const MenuItemSchema = new Schema(
    {
        id: String,
        label: { type: String, required: true },
        type: { type: String, enum: ["internal", "external", "dropdown"], required: true },
        link: String,
        enabled: { type: Boolean, default: true },
        order: Number,
        children: [{ type: Schema.Types.Mixed }],
    },
    { _id: false },
)
