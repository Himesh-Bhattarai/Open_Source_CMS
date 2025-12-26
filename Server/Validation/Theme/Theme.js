import {z} from'zod';

export const ThemeSchema = z.object({
    tenantId: z.string(),
    colors: z.object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
        background: z.string(),
        text: z.string(),
    }),
    typography: z.object({
        bodyFont: z.string(),
        headingFont: z.string(),
        fontSize: z.string(),
    }),
    layout: z.object({
        containerWidth: z.string(),
        spacing: z.string(),
        borderRadius: z.string(),
    }),
    header: z.object({
        style: z.enum(["fixed", "sticky", "standard"]),
        variant: z.enum(["centered", "left", "split"]),
    }),
    footer: z.object({
        variant: z.enum(["multi-column", "minimal", "centered"]),
    }),
})