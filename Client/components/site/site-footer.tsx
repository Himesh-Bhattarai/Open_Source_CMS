import Link from "next/link";

interface FooterLink {
  label?: string;
  slug?: string;
  href?: string;
}

interface FooterBlock {
  id?: string;
  type?: string;
  data?: {
    title?: string;
    links?: FooterLink[];
  };
}

interface FooterData {
  blocks?: FooterBlock[];
  bottomBar?: {
    copyrightText?: string;
  };
}

interface SiteFooterProps {
  tenant: string;
  footerData?: FooterData | null;
}

const fallbackColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const resolveHref = (tenant: string, rawHref: string | undefined) => {
  const href = String(rawHref || "").trim();
  if (!href || href === "/") return `/site/${tenant}`;
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#")) {
    return href;
  }
  return `/site/${tenant}${href.startsWith("/") ? href : `/${href}`}`;
};

export function SiteFooter({ tenant, footerData = null }: SiteFooterProps) {
  const menuBlocks = Array.isArray(footerData?.blocks)
    ? footerData.blocks.filter((block) => block?.type === "menu")
    : [];

  const columns = menuBlocks.length
    ? menuBlocks.map((block) => ({
        title: block?.data?.title || "Links",
        links: Array.isArray(block?.data?.links)
          ? block.data.links.map((link) => ({
              label: link?.label || "Link",
              href: resolveHref(tenant, link?.slug || link?.href),
            }))
          : [],
      }))
    : fallbackColumns.map((column) => ({
        ...column,
        links: column.links.map((link) => ({
          ...link,
          href: resolveHref(tenant, link.href),
        })),
      }));

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={`/site/${tenant}`} className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-lg">Logo</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Building amazing websites with our powerful content management platform.
            </p>
          </div>

          {columns.slice(0, 3).map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            {footerData?.bottomBar?.copyrightText || "(c) 2025 Your Company. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
