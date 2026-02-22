import type { MetadataRoute } from "next";

const SITE_ORIGIN = process.env.CMS_PUBLIC_SITE_ORIGIN || "";

const normalizeOrigin = (value: string) => {
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return "";
  }
};

export default function robots(): MetadataRoute.Robots {
  const origin = normalizeOrigin(SITE_ORIGIN);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cms", "/api", "/login", "/signup", "/forgot-password"],
      },
    ],
    ...(origin ? { sitemap: `${origin}/sitemap.xml`, host: origin } : {}),
  };
}
