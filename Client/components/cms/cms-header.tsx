"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Moon, Sun, Menu, Shield, User, SettingsIcon, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CMSHeaderProps {
  onMenuClick?: () => void
}

export function CMSHeader({ onMenuClick }: CMSHeaderProps) {
  const { setTheme, theme } = useTheme()
  const { user, isAdmin, impersonatedTenant, stopImpersonation, isImpersonating } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("cms_auth")
    router.push("/login")
  }

  return (
    <header className="h-14 md:h-16 border-b bg-card shrink-0 flex items-center justify-between px-3 md:px-6 gap-2 md:gap-4">
      {isImpersonating && (
        <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white px-4 py-1 text-xs flex items-center justify-center gap-2 z-50">
          <Shield className="h-3 w-3" />
          <span>
            Viewing as: <strong>{impersonatedTenant?.name}</strong>
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 px-2 ml-2 text-white hover:bg-amber-600"
            onClick={stopImpersonation}
          >
            Exit View
          </Button>
        </div>
      )}

      <div className={`flex items-center gap-2 md:gap-3 ${isImpersonating ? "mt-6" : ""}`}>
        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden lg:flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CF</span>
          </div>
          <span className="font-semibold text-lg">ContentFlow</span>
        </div>
      </div>

      <div className={`flex-1 max-w-xl ${searchOpen ? "block" : "hidden md:block"}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages, menus, media..."
            className="pl-10 h-9 md:h-10"
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setSearchOpen(!searchOpen)}>
          <Search className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
            <div className="p-3">
              <p className="font-semibold mb-3">Notifications</p>
              <div className="space-y-2">
                <div className="p-3 rounded-md bg-muted/50 text-sm">
                  <p className="font-medium">Menu updated</p>
                  <p className="text-xs text-muted-foreground mt-1">Mike R. published Main Navigation</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-9 px-2 md:px-3">
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-sm font-medium leading-tight">{user?.name}</p>
                <p className="text-xs text-muted-foreground leading-tight">{user?.tenantName || "Platform"}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate mb-2">{user?.email}</p>
                  {isAdmin ? (
                    <Badge variant="default" className="bg-primary">
                      <Shield className="h-3 w-3 mr-1" />
                      Platform Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {user?.role === "owner" && "Website Owner"}
                      {user?.role === "manager" && "Manager"}
                      {user?.role === "editor" && "Editor"}
                      {user?.role === "viewer" && "Viewer"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
