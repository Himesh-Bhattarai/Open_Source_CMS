import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SiteMenuItem {
  _id?: string;
  label?: string;
  link?: string;
  href?: string;
  enabled?: boolean;
}

interface SiteHeaderProps {
  tenant: string;
  menuItems?: SiteMenuItem[];
}

const defaultMenuItems: SiteMenuItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
];

const resolveHref = (tenant: string, rawHref: string | undefined) => {
  const href = String(rawHref || "").trim();
  if (!href || href === "/") return `/site/${tenant}`;
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#")) {
    return href;
  }
  return `/site/${tenant}${href.startsWith("/") ? href : `/${href}`}`;
};

export function SiteHeader({ tenant, menuItems = [] }: SiteHeaderProps) {
  const resolvedMenu = menuItems.length
    ? menuItems
        .filter((item) => item?.enabled !== false)
        .map((item) => ({
          label: item.label || "Untitled",
          href: resolveHref(tenant, item.link),
        }))
    : defaultMenuItems.map((item) => ({
        label: item.label || "Untitled",
        href: resolveHref(tenant, item.href),
      }));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/site/${tenant}`} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                L
              </span>
            </div>
            <span className="font-semibold text-lg">Logo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {resolvedMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
