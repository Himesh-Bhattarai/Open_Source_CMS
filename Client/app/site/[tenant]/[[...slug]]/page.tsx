import { BlockRenderer } from "@/components/site/block-renderer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

type SiteParams = {
  tenant: string;
  slug?: string[];
};

const API_BASE_URL = process.env.CMS_API_BASE_URL || "";
const API_KEY = process.env.CMS_PUBLIC_API_KEY || "";

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

const fetchExternal = async (tenant: string, path: string) => {
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
  return response.json().catch(() => null);
};

const normalizeBlocks = (page: any) => {
  const tree = page?.pageTree;
  if (Array.isArray(tree?.blocks)) return tree.blocks;
  if (Array.isArray(tree)) return tree;
  if (Array.isArray(page?.blocks)) return page.blocks;
  return [];
};

const resolvePageBySlug = async (tenant: string, slugPath: string) => {
  if (slugPath) {
    const payload = await fetchExternal(tenant, `/pages/${encodeURIComponent(slugPath)}`);
    return payload?.page || null;
  }

  const pagesPayload = await fetchExternal(tenant, "/pages");
  const pages = Array.isArray(pagesPayload?.pages) ? pagesPayload.pages : [];
  const homepage = pages.find((p: any) => Boolean(p?.settings?.isHomepage)) || pages[0];
  if (!homepage?.slug) return null;

  const singlePayload = await fetchExternal(tenant, `/pages/${encodeURIComponent(homepage.slug)}`);
  return singlePayload?.page || null;
};

export default async function SitePage({ params }: { params: SiteParams }) {
  const tenant = params.tenant;
  const slugPath = params.slug ? params.slug.join("/") : "";

  const [page, menuPayload, footerPayload] = await Promise.all([
    resolvePageBySlug(tenant, slugPath),
    fetchExternal(tenant, "/menu"),
    fetchExternal(tenant, "/footer"),
  ]);

  const blocks = normalizeBlocks(page);
  const menuItems = Array.isArray(menuPayload?.getMenu?.[0]?.items)
    ? menuPayload.getMenu[0].items
    : [];
  const footerData = footerPayload?.footer || null;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader tenant={tenant} menuItems={menuItems} />
      <main className="flex-1">
        <BlockRenderer blocks={blocks.length ? blocks : fallbackBlocks} />
      </main>
      <SiteFooter tenant={tenant} footerData={footerData} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: SiteParams }) {
  const tenant = params.tenant;
  const slugPath = params.slug ? params.slug.join("/") : "";
  const page = await resolvePageBySlug(tenant, slugPath);

  return {
    title: page?.seo?.metaTitle || page?.title || "Website",
    description:
      page?.seo?.metaDescription || "Create beautiful, professional websites without coding",
  };
}
