"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
  Briefcase,
  Plug,
  Database,
  BarChart3,
  Activity,
  Bell,
  FormInput,
  Shield,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

const adminNavigation = [
  { name: "Dashboard", href: "/cms", icon: LayoutDashboard },
  {
    name: "Websites",
    icon: Building2,
    children: [
      { name: "All Websites", href: "/cms/tenants", icon: Building2 },
      { name: "Create New", href: "/cms/tenants/new", icon: Building2 },
    ],
  },
  {
    name: "System",
    icon: Settings,
    children: [
      { name: "Platform Analytics", href: "/cms/analytics", icon: BarChart3 },
      { name: "System Logs", href: "/cms/activity", icon: Activity },
      { name: "All Users", href: "/cms/users", icon: Users },
      { name: "Platform Settings", href: "/cms/settings", icon: Settings },
    ],
  },
]

const getTenantNavigation = (integrations?: any) => {
  const baseNav = [{ name: "Dashboard", href: "/cms", icon: LayoutDashboard, alwaysShow: true }]

  const contentChildren = []
  if (integrations?.pages) contentChildren.push({ name: "Pages", href: "/cms/content/pages", icon: FileText })
  if (integrations?.blog) contentChildren.push({ name: "Blog Posts", href: "/cms/content/blog", icon: Newspaper })
  contentChildren.push(
    { name: "Collections", href: "/cms/content/collections", icon: FolderOpen },
    { name: "Content Types", href: "/cms/content/types", icon: Layers },
  )

  baseNav.push({
    name: "Content",
    icon: FileText,
    children: contentChildren,
  } as any)

  const globalChildren = []
  if (integrations?.menu) globalChildren.push({ name: "Menus", href: "/cms/global/menus", icon: MenuIcon })
  if (integrations?.footer) globalChildren.push({ name: "Footer", href: "/cms/global/footer", icon: Footprints })
  globalChildren.push(
    { name: "SEO Settings", href: "/cms/global/seo", icon: Search },
    { name: "Layout & Theme", href: "/cms/global/layout", icon: Palette },
  )

  baseNav.push({
    name: "Global",
    icon: Globe,
    highlight: true,
    children: globalChildren,
  } as any)

  baseNav.push(
    { name: "Theme", href: "/cms/theme", icon: Palette, alwaysShow: true },
    { name: "Forms", href: "/cms/forms", icon: FormInput, alwaysShow: true },
    { name: "Media Library", href: "/cms/media", icon: ImageIcon, alwaysShow: true },
    { name: "Backups", href: "/cms/backups", icon: Database, alwaysShow: true },
    { name: "Analytics", href: "/cms/analytics", icon: BarChart3, alwaysShow: true },
    { name: "Activity", href: "/cms/activity", icon: Activity, alwaysShow: true },
    { name: "Notifications", href: "/cms/notifications", icon: Bell, alwaysShow: true },
    { name: "Team", href: "/cms/users", icon: Users, alwaysShow: true },
    { name: "Integrations", href: "/cms/integrations", icon: Plug, alwaysShow: true },
  )

  return baseNav
}

interface CMSSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function CMSSidebar({ isOpen = false, onClose }: CMSSidebarProps) {
  const pathname = usePathname()
  const { user, isAdmin, isOwner, isImpersonating, impersonatedTenant } = useAuth()

  const navigation = isAdmin && !isImpersonating ? adminNavigation : getTenantNavigation(user?.integrations)

  useEffect(() => {
    if (onClose) onClose()
  }, [pathname])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

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
        <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b border-sidebar-border flex-shrink-0">
          <Link href="/cms" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CF</span>
            </div>
            <span className="font-semibold text-lg">ContentFlow</span>
          </Link>

          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {(isOwner || isImpersonating) && (
          <div className="px-4 py-3 border-b border-sidebar-border flex-shrink-0">
            <div
              className={cn(
                "border rounded-lg p-3",
                isImpersonating
                  ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
                  : "bg-primary/10 border-primary/20",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {isImpersonating ? (
                  <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Briefcase className="h-4 w-4 text-primary" />
                )}
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    isImpersonating ? "text-amber-600 dark:text-amber-400" : "text-primary",
                  )}
                >
                  {isImpersonating ? "Viewing As Owner" : "Your Website"}
                </span>
              </div>
              <p className="text-sm font-medium truncate">
                {isImpersonating ? impersonatedTenant?.name : user?.tenantName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isImpersonating ? impersonatedTenant?.id : user?.tenantId}
              </p>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-3">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div
                    className={cn(
                      "space-y-1",
                      item.highlight && "bg-primary/5 rounded-lg p-2 border border-primary/20",
                    )}
                  >
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">{item.name}</span>
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

        <div className="p-3 border-t border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent/50">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-xs font-medium">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
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
  )
}
