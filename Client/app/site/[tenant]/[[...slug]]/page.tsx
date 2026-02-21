import type { Metadata } from "next";
import { BlockRenderer } from "@/components/site/block-renderer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

type SiteParams = {
  tenant: string;
  slug?: string[];
};

type OpenGraphType = "website" | "article";
type TwitterCardType = "summary" | "summary_large_image" | "app" | "player";

type PublicPageSEO = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  ogImage?: string;
  keywords?: string[];
  robots?: {
    index?: boolean;
    follow?: boolean;
    maxImagePreview?: "none" | "standard" | "large";
    maxSnippet?: number;
    maxVideoPreview?: number;
  };
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: OpenGraphType;
  };
  twitter?: {
    card?: TwitterCardType;
    title?: string;
    description?: string;
    image?: string;
    site?: string;
  };
  structuredData?: unknown;
};

type PublicPage = {
  title?: string;
  slug?: string;
  seo?: PublicPageSEO;
  pageTree?: {
    blocks?: unknown[];
  };
  blocks?: unknown[];
  settings?: {
    isHomepage?: boolean;
  };
};

type SiteBlock = {
  id: string;
  type: string;
  data: Record<string, unknown>;
};

type SiteMenuItemPayload = {
  _id?: string;
  label?: string;
  link?: string;
  href?: string;
  enabled?: boolean;
};

type FooterLinkPayload = {
  label?: string;
  slug?: string;
  href?: string;
};

type FooterDataPayload = {
  blocks?: Array<{
    id?: string;
    type?: string;
    data?: {
      title?: string;
      links?: FooterLinkPayload[];
    };
  }>;
  bottomBar?: {
    copyrightText?: string;
  };
};

type GlobalSeoSettings = {
  general?: {
    siteTitle?: string;
    metaDescription?: string;
    defaultOgImage?: string;
    siteUrl?: string;
  };
  robots?: {
    indexPages?: boolean;
    followLinks?: boolean;
    stagingNoIndex?: boolean;
  };
  social?: {
    ogSiteName?: string;
    twitterCard?: string;
    twitterSite?: string;
  };
};

type ExternalSeoPayload = {
  getSeo?: {
    globalSEO?: GlobalSeoSettings;
  };
};

const API_BASE_URL = process.env.CMS_API_BASE_URL || "";
const API_KEY = process.env.CMS_PUBLIC_API_KEY || "";
const PREVIEW_SITE_ORIGIN = process.env.CMS_PUBLIC_SITE_ORIGIN || "";

const DEFAULT_TITLE = "Website";
const DEFAULT_DESCRIPTION =
  "Create beautiful, professional websites without coding";

const fallbackBlocks = [
  {
    id: "hero-fallback",
    type: "hero",
    data: {
      title: "Build Amazing Websites",
      subtitle: "Create beautiful, professional websites without coding",
      buttonText: "Get Started",
      buttonLink: "/contact",
    },
  },
  {
    id: "features-fallback",
    type: "features",
    data: {
      title: "Why Choose Us",
      features: [
        { title: "Easy to Use", description: "Intuitive drag-and-drop interface", icon: "layout" },
        { title: "Fast Performance", description: "Lightning-fast page loads", icon: "zap" },
        { title: "Fully Responsive", description: "Works on all devices", icon: "smartphone" },
      ],
    },
  },
];

const fetchExternal = async <T,>(tenant: string, path: string) => {
  if (!API_BASE_URL || !API_KEY || !tenant) return null;

  const response = await fetch(
    `${API_BASE_URL}/api/v1/external-request/${encodeURIComponent(tenant)}${path}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      next: { revalidate: 60 },
    },
  );

  if (!response.ok) return null;
  return (await response.json().catch(() => null)) as T | null;
};

const asNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeBlocks = (page: PublicPage | null): SiteBlock[] => {
  if (!page) return [];
  const source = Array.isArray(page.pageTree?.blocks)
    ? page.pageTree.blocks
    : Array.isArray(page.blocks)
      ? page.blocks
      : [];

  return source
    .filter((block) => Boolean(block) && typeof block === "object")
    .map((block, index) => {
      const normalized = block as Record<string, unknown>;
      return {
        id: asNonEmptyString(normalized.id) || `block-${index}`,
        type: asNonEmptyString(normalized.type) || "text",
        data:
          normalized.data && typeof normalized.data === "object"
            ? (normalized.data as Record<string, unknown>)
            : {},
      };
    });
};

const resolvePageBySlug = async (tenant: string, slugPath: string) => {
  if (slugPath) {
    const payload = await fetchExternal<{ page?: PublicPage }>(
      tenant,
      `/pages/${encodeURIComponent(slugPath)}`,
    );
    return payload?.page || null;
  }

  const pagesPayload = await fetchExternal<{ pages?: PublicPage[] }>(
    tenant,
    "/pages",
  );
  const pages = Array.isArray(pagesPayload?.pages) ? pagesPayload.pages : [];
  const homepage = pages.find((p) => Boolean(p?.settings?.isHomepage)) || pages[0];
  if (!homepage?.slug) return null;

  const singlePayload = await fetchExternal<{ page?: PublicPage }>(
    tenant,
    `/pages/${encodeURIComponent(homepage.slug)}`,
  );
  return singlePayload?.page || null;
};

const normalizeBaseUrl = (value?: string) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
};

const toAbsoluteUrl = (value?: string, base?: string) => {
  const normalizedValue = asNonEmptyString(value);
  if (!normalizedValue) return undefined;

  try {
    return new URL(normalizedValue).toString();
  } catch {
    if (!base) return undefined;
    try {
      return new URL(normalizedValue, `${base}/`).toString();
    } catch {
      return undefined;
    }
  }
};

const resolveTwitterCard = (
  pageCard?: string,
  globalCard?: string,
): TwitterCardType => {
  const candidate = asNonEmptyString(pageCard) || asNonEmptyString(globalCard);
  if (candidate === "summary") return candidate;
  if (candidate === "summary_large_image") return candidate;
  if (candidate === "app") return candidate;
  if (candidate === "player") return candidate;
  return "summary_large_image";
};

const resolveCanonical = ({
  pageCanonical,
  globalSiteUrl,
  tenant,
  slugPath,
}: {
  pageCanonical?: string;
  globalSiteUrl?: string;
  tenant: string;
  slugPath: string;
}) => {
  const normalizedGlobal = normalizeBaseUrl(globalSiteUrl);
  const normalizedPreview = normalizeBaseUrl(PREVIEW_SITE_ORIGIN);

  const explicitCanonical = toAbsoluteUrl(
    pageCanonical,
    normalizedGlobal || normalizedPreview,
  );
  if (explicitCanonical) return explicitCanonical;

  const relativePath = slugPath ? `${slugPath}` : "";

  if (normalizedGlobal) {
    return new URL(relativePath, `${normalizedGlobal}/`).toString();
  }

  if (normalizedPreview) {
    const previewPath = slugPath
      ? `site/${tenant}/${slugPath}`
      : `site/${tenant}`;
    return new URL(previewPath, `${normalizedPreview}/`).toString();
  }

  return undefined;
};

const resolveRobots = (
  pageSeo: PublicPageSEO | undefined,
  globalRobots: GlobalSeoSettings["robots"],
): Metadata["robots"] => {
  const stagingNoIndex =
    globalRobots?.stagingNoIndex && process.env.NODE_ENV !== "production";

  const index = stagingNoIndex
    ? false
    : pageSeo?.noIndex
      ? false
      : (pageSeo?.robots?.index ?? globalRobots?.indexPages ?? true);
  const follow = stagingNoIndex
    ? false
    : (pageSeo?.robots?.follow ?? globalRobots?.followLinks ?? true);

  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      ...(pageSeo?.robots?.maxImagePreview
        ? { maxImagePreview: pageSeo.robots.maxImagePreview }
        : {}),
      ...(typeof pageSeo?.robots?.maxSnippet === "number"
        ? { maxSnippet: pageSeo.robots.maxSnippet }
        : {}),
      ...(typeof pageSeo?.robots?.maxVideoPreview === "number"
        ? { maxVideoPreview: pageSeo.robots.maxVideoPreview }
        : {}),
    },
  };
};

const parseStructuredData = (value: unknown) => {
  if (!value) return null;
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  return null;
};

const buildPageMetadata = ({
  page,
  tenant,
  slugPath,
  globalSeo,
}: {
  page: PublicPage | null;
  tenant: string;
  slugPath: string;
  globalSeo: GlobalSeoSettings | null;
}): Metadata => {
  const pageSeo = page?.seo;
  const globalSiteUrl = globalSeo?.general?.siteUrl;

  const title =
    asNonEmptyString(pageSeo?.metaTitle) ||
    asNonEmptyString(page?.title) ||
    asNonEmptyString(globalSeo?.general?.siteTitle) ||
    DEFAULT_TITLE;

  const description =
    asNonEmptyString(pageSeo?.metaDescription) ||
    asNonEmptyString(globalSeo?.general?.metaDescription) ||
    DEFAULT_DESCRIPTION;

  const canonical = resolveCanonical({
    pageCanonical: pageSeo?.canonicalUrl,
    globalSiteUrl,
    tenant,
    slugPath,
  });

  const openGraphTitle =
    asNonEmptyString(pageSeo?.openGraph?.title) || title;
  const openGraphDescription =
    asNonEmptyString(pageSeo?.openGraph?.description) || description;
  const openGraphImage = toAbsoluteUrl(
    pageSeo?.openGraph?.image ||
      pageSeo?.ogImage ||
      globalSeo?.general?.defaultOgImage,
    normalizeBaseUrl(globalSiteUrl) || normalizeBaseUrl(PREVIEW_SITE_ORIGIN),
  );

  const twitterImage = toAbsoluteUrl(
    pageSeo?.twitter?.image || openGraphImage,
    normalizeBaseUrl(globalSiteUrl) || normalizeBaseUrl(PREVIEW_SITE_ORIGIN),
  );

  const metadata: Metadata = {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      type: pageSeo?.openGraph?.type === "article" ? "article" : "website",
      ...(canonical ? { url: canonical } : {}),
      ...(openGraphImage ? { images: [openGraphImage] } : {}),
      ...(asNonEmptyString(globalSeo?.social?.ogSiteName)
        ? { siteName: globalSeo?.social?.ogSiteName }
        : {}),
    },
    twitter: {
      card: resolveTwitterCard(
        pageSeo?.twitter?.card,
        globalSeo?.social?.twitterCard,
      ),
      title: asNonEmptyString(pageSeo?.twitter?.title) || openGraphTitle,
      description:
        asNonEmptyString(pageSeo?.twitter?.description) || openGraphDescription,
      ...(twitterImage ? { images: [twitterImage] } : {}),
      ...(asNonEmptyString(pageSeo?.twitter?.site) ||
      asNonEmptyString(globalSeo?.social?.twitterSite)
        ? {
            site:
              asNonEmptyString(pageSeo?.twitter?.site) ||
              asNonEmptyString(globalSeo?.social?.twitterSite),
          }
        : {}),
    },
    robots: resolveRobots(pageSeo, globalSeo?.robots),
  };

  const keywords = Array.isArray(pageSeo?.keywords)
    ? pageSeo.keywords
        .map((keyword) => asNonEmptyString(keyword))
        .filter((keyword): keyword is string => Boolean(keyword))
    : [];
  if (keywords.length > 0) {
    metadata.keywords = keywords;
  }

  return metadata;
};

const serializeJsonLd = (value: Record<string, unknown>) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export default async function SitePage({ params }: { params: SiteParams }) {
  const tenant = params.tenant;
  const slugPath = params.slug ? params.slug.join("/") : "";

  const [page, menuPayload, footerPayload] = await Promise.all([
    resolvePageBySlug(tenant, slugPath),
    fetchExternal<{ getMenu?: Array<{ items?: SiteMenuItemPayload[] }> }>(
      tenant,
      "/menu",
    ),
    fetchExternal<{ footer?: FooterDataPayload }>(tenant, "/footer"),
  ]);

  const blocks = normalizeBlocks(page);
  const menuItems = Array.isArray(menuPayload?.getMenu?.[0]?.items)
    ? menuPayload.getMenu[0].items
    : [];
  const footerData = footerPayload?.footer || null;
  const jsonLd = parseStructuredData(page?.seo?.structuredData);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader tenant={tenant} menuItems={menuItems} />
      <main className="flex-1">
        <BlockRenderer blocks={blocks.length ? blocks : fallbackBlocks} />
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
          />
        ) : null}
      </main>
      <SiteFooter tenant={tenant} footerData={footerData} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: SiteParams;
}): Promise<Metadata> {
  const tenant = params.tenant;
  const slugPath = params.slug ? params.slug.join("/") : "";

  const [page, seoPayload] = await Promise.all([
    resolvePageBySlug(tenant, slugPath),
    fetchExternal<ExternalSeoPayload>(tenant, "/seo"),
  ]);

  const globalSeo = seoPayload?.getSeo?.globalSEO || null;
  return buildPageMetadata({ page, tenant, slugPath, globalSeo });
}
