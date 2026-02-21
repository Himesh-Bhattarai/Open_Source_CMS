import type { MetadataRoute } from "next";

const SITE_ORIGIN = process.env.CMS_PUBLIC_SITE_ORIGIN || "";
const API_BASE_URL = process.env.CMS_API_BASE_URL || "";
const API_KEY = process.env.CMS_PUBLIC_API_KEY || "";
const DEFAULT_TENANT = process.env.CMS_DEFAULT_TENANT_DOMAIN || "";

const normalizeOrigin = (value: string) => {
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return "";
  }
};

const buildAbsoluteUrl = (origin: string, path: string) => new URL(path, `${origin}/`).toString();

const getPublicStaticRoutes = (origin: string): MetadataRoute.Sitemap => {
  const now = new Date();
  const routes = ["/", "/about", "/careers", "/contact", "/docs", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: buildAbsoluteUrl(origin, route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));
};

const getTenantPageRoutes = async (origin: string): Promise<MetadataRoute.Sitemap> => {
  if (!API_BASE_URL || !API_KEY || !DEFAULT_TENANT) return [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/external-request/${encodeURIComponent(DEFAULT_TENANT)}/pages`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) return [];

    const payload = (await response.json().catch(() => null)) as {
      pages?: Array<{
        slug?: string;
        settings?: { isHomepage?: boolean };
        updatedAt?: string;
      }>;
    } | null;

    const pages = Array.isArray(payload?.pages) ? payload.pages : [];
    return pages
      .map((page) => {
        const slug = typeof page.slug === "string" ? page.slug.trim() : "";
        const isHomepage = page.settings?.isHomepage === true;
        const path =
          isHomepage || !slug ? `/site/${DEFAULT_TENANT}` : `/site/${DEFAULT_TENANT}/${slug}`;

        return {
          url: buildAbsoluteUrl(origin, path),
          lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: isHomepage ? 0.9 : 0.7,
        };
      })
      .filter((item, index, items) => {
        return items.findIndex((candidate) => candidate.url === item.url) === index;
      });
  } catch {
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = normalizeOrigin(SITE_ORIGIN);
  if (!origin) return [];

  const [staticRoutes, tenantRoutes] = await Promise.all([
    Promise.resolve(getPublicStaticRoutes(origin)),
    getTenantPageRoutes(origin),
  ]);

  return [...staticRoutes, ...tenantRoutes];
}
