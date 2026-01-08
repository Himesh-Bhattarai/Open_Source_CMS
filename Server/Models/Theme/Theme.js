import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ThemeSchema = new Schema(
    {
        // tenantId = websiteId (for now)
        tenantId: {
            type: String,
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        colors: {
            primary: String,
            secondary: String,
            background: String,
            text: String,
            accent: String,
        },

        typography: {
            headingFont: String,
            bodyFont: String,
            fontSize: String,
        },

        layout: {
            containerWidth: {
                type: String,
                enum: ["full", "boxed"],
            },
            borderRadius: {
                type: String,
                enum: ["none", "small", "medium", "large"],
            },
            sectionSpacing: {
                type: String,
                enum: ["compact", "normal", "spacious"],
            },
            headerStyle: {
                type: String,
                enum: ["fixed", "sticky", "standard"],
            },
        },

        customCss: {
            type: String,
            default: "",
        },

        metadata: {
            scope: {
                type: String,
                enum: ["global"],
                default: "global",
            },
            version: {
                type: Number,
                default: 1,
            },
            lastUpdated: {
                type: Date,
                default: Date.now,
            },
        },

        createdBy: {
            type: String, // userId
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "themes",
    }
);

// One global theme per website
ThemeSchema.index({ tenantId: 1, "metadata.scope": 1 }, { unique: true });

export const Theme = models.Theme || model("Theme", ThemeSchema);
