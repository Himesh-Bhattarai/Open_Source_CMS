const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        name: { type: String, required: true },
        avatar: String,
        role: { type: String, enum: ["admin", "web-owner", "manager", "editor", "viewer"], default: "web-owner" },
        status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
        lastLogin: Date,
        twoFactorEnabled: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: "users",
    },
)

UserSchema.index({ email: 1 })

export const User = models.User || model("User", UserSchema)