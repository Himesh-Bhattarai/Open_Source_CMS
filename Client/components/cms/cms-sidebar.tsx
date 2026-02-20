"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Globe,
  ImageIcon,
  Users,
  Settings,
  MenuIcon,
  Footprints,
  Palette,
  Search,
  FolderOpen,
  Newspaper,
  Layers,
  Building2,
  X,
  Crown,
  Plug,
  Database,
  BarChart3,
  Activity,
  Bell,
  FormInput,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

type IconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

interface NavLinkItem {
  type: "link";
  name: string;
  href: string;
  icon: IconType;
}

interface NavGroupItem {
  type: "group";
  name: string;
  icon: IconType;
  highlight?: boolean;
  children: NavLinkItem[];
}

type NavigationItem = NavLinkItem | NavGroupItem;
const adminNavigation: NavigationItem[] = [
  { type: "link", name: "Overview", href: "/cms", icon: LayoutDashboard },
  { type: "link", name: "All Users", href: "/cms/admin/users", icon: Users },
  {
    type: "link",
    name: "Platform Analytics",
    href: "/cms/admin/analytics",
    icon: BarChart3,
  },
  {
    type: "link",
    name: "System Logs",
    href: "/cms/admin/logs",
    icon: Activity,
  },
];

const ownerNavigation: NavigationItem[] = [
  { type: "link", name: "Dashboard", href: "/cms", icon: LayoutDashboard },
  {
    type: "link",
    name: "My Website",
    href: "/cms/my-website",
    icon: Building2,
  },

  {
    type: "group",
    name: "Content",
    icon: FileText,
    children: [
      {
        type: "link",
        name: "Pages",
        href: "/cms/content/pages",
        icon: FileText,
      },
      {
        type: "link",
        name: "Blog Posts",
        href: "/cms/content/blog",
        icon: Newspaper,
      },
    ],
  },

  {
    type: "group",
    name: "Global",
    icon: Globe,
    highlight: true,
    children: [
      {
        type: "link",
        name: "Menus",
        href: "/cms/global/menus",
        icon: MenuIcon,
      },
      {
        type: "link",
        name: "Footer",
        href: "/cms/global/footer",
        icon: Footprints,
      },
      {
        type: "link",
        name: "SEO Settings",
        href: "/cms/global/seo",
        icon: Search,
      },
    ],
  },

  { type: "link", name: "Theme", href: "/cms/theme", icon: Palette },
  { type: "link", name: "Forms", href: "/cms/forms", icon: FormInput },
  { type: "link", name: "Media Library", href: "/cms/media", icon: ImageIcon },
  { type: "link", name: "Backups", href: "/cms/backups", icon: Database },
  {
    type: "link",
    name: "Notifications",
    href: "/cms/notifications",
    icon: Bell,
  },
  { type: "link", name: "Integrations", href: "/cms/integrations", icon: Plug },
];

interface CMSSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CMSSidebar({ isOpen = false, onClose }: CMSSidebarProps) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  const navigation = isAdmin ? adminNavigation : ownerNavigation;

  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r bg-sidebar flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
        )}
      >
        <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b border-sidebar-border shrink-0">
          <Link href="/cms" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                CF
              </span>
            </div>
            <span className="font-semibold text-lg">ContentFlow</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 overflow-y-auto ">
          <nav className="space-y-1 p-3">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.type === "group" ? (
                  <div
                    className={cn(
                      "space-y-1",
                      item.highlight &&
                        "bg-primary/5 rounded-lg p-2 border border-primary/20",
                    )}
                  >
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        {item.name}
                      </span>
                    </div>

                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                          pathname === child.href
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-3 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent/50">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-xs font-medium">
                {user?.name
                  ?.split(" ")
                  ?.map((n: string) => n[0])
                  ?.join("")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <div className="flex items-center gap-1">
                {isAdmin && <Crown className="h-3 w-3 text-amber-500" />}
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {isAdmin ? "Platform Admin" : "Website Owner"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
