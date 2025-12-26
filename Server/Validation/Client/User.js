import {z} from 'zod';

const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(24),
    name: z.string().min(3).max(50),
    avatar: z.string().optional(),
    status:z.enum(["active", "inactive", "suspended"]).default("active"),
    lastLogin: z.date().optional(),
    twoFactorEnabled: z.boolean().default(false),
});

export default UserSchema;

