"use client";

import { logoutApi } from "@/Api/Auth/Logout";
import { getNotification } from "@/Api/Notification/notification";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Bell, Search, Moon, Sun, Menu, Shield, User, SettingsIcon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CMSHeaderProps {
  onMenuClick?: () => void;
}

interface RawNotification {
  _id?: string;
  type?: string;
  title?: string;
  message?: string;
  createdAt?: string;
  read?: boolean;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function CMSHeader({ onMenuClick }: CMSHeaderProps) {
  const { setTheme, theme } = useTheme();
  const { user, isAdmin, impersonatedTenant, stopImpersonation, isImpersonating } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    setUnread(notifications.some((item) => !item.read));
  }, [notifications]);

  const handleOpen = () => {
    // Mark the dot as gone once dropdown is opened.
    setUnread(false);
  };

  const handleLogout = async () => {
    await logoutApi();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const loadNotification = async () => {
      try {
        const notif = await getNotification();
        if (!notif?.ok) return;

        const notificationsArray = Array.isArray(notif.data?.notifications)
          ? (notif.data.notifications as RawNotification[])
          : [];

        // Map _id to id and createdAt to time.
        const formatted = notificationsArray.map(
          (item): NotificationItem => ({
            id: String(item._id || ""),
            type: String(item.type || "info").toLowerCase(),
            title: String(item.title || "Notification"),
            message: String(item.message || ""),
            time: String(item.createdAt || new Date().toISOString()),
            read: Boolean(item.read),
          }),
        );

        const tenDaysAgo = Date.now() - 10 * 24 * 60 * 60 * 1000;
        const top5 = formatted
          .filter((item) => new Date(item.time).getTime() >= tenDaysAgo)
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 5);

        setNotifications(top5);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };

    loadNotification();
  }, []);

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
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>

        <DropdownMenu onOpenChange={handleOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              {unread && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
            <div className="p-3">
              <p className="font-semibold mb-3">Notifications</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div
                    key={`${notification.id}-${index}`}
                    className="p-3 rounded-md bg-muted/50 text-sm"
                  >
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                ))}
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
                <p className="text-xs text-muted-foreground leading-tight">
                  {user?.tenantName || "Platform"}
                </p>
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
                      {user?.role === "web-owner" && "web-owner"}
                      {user?.role === "manager" && "Manager"}
                      {user?.role === "editor" && "Editor"}
                      {user?.role === "viewer" && "Viewer"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/cms/settings")}>
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
  );
}
