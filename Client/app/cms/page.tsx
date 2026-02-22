"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Globe,
  ImageIcon,
  Users,
  Clock,
  Building2,
  HardDrive,
  Zap,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { fetchStats } from "@/Api/Stats/Stats";

export default function CMSDashboard() {
  const { user, isAdmin } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <OwnerDashboard user={user} />;
}

function AdminDashboard() {
  const stats = [
    {
      label: "Total Users",
      value: "48",
      icon: Users,
      change: "+5 this week",
      trend: "up",
      color: "text-blue-600",
    },
    {
      label: "Active Websites",
      value: "12",
      icon: Building2,
      change: "+2 this month",
      trend: "up",
      color: "text-green-600",
    },
    {
      label: "Total Storage",
      value: "24.5 GB",
      icon: HardDrive,
      change: "48% of limit",
      trend: "neutral",
      color: "text-purple-600",
    },
    {
      label: "API Calls",
      value: "1.2M",
      icon: Zap,
      change: "+12% this week",
      trend: "up",
      color: "text-orange-600",
    },
  ];

  const recentUsers = [
    {
      name: "Sarah Johnson",
      email: "sarah@acmecorp.com",
      website: "ACME Corporation",
      status: "active",
      joinedAt: "2 days ago",
    },
    {
      name: "Mike Rodriguez",
      email: "mike@techstart.com",
      website: "TechStart Inc",
      status: "active",
      joinedAt: "1 week ago",
    },
    {
      name: "Emily Chen",
      email: "emily@greenearth.com",
      website: "Green Earth Co",
      status: "trial",
      joinedAt: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-balance text-3xl sm:text-4xl font-bold tracking-tight">
          Platform Overview
        </h1>
        <p className="text-pretty text-muted-foreground mt-2">
          Monitor all users and system health
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-5 w-5" />
                Recent Users
              </CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/cms/admin/users">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.email}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border hover:border-primary/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{user.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {user.website}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {user.joinedAt}
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/cms/admin/users/${user.email}`}>View Details</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          <CardDescription>Platform management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 bg-transparent"
            >
              <Link href="/cms/admin/users">
                <Users className="h-5 w-5" />
                <span className="text-xs sm:text-sm">View All Users</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 bg-transparent"
            >
              <Link href="/cms/admin/analytics">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Analytics</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 bg-transparent"
            >
              <Link href="/cms/admin/logs">
                <Activity className="h-5 w-5" />
                <span className="text-xs sm:text-sm">System Logs</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardOwnerUser {
  name?: string;
}

interface DashboardStat {
  label: string;
  value: number | string;
  icon: LucideIcon;
  change: string;
  color: string;
}

function OwnerDashboard({ user }: { user: DashboardOwnerUser | null }) {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch stats once on mount
  useEffect(() => {
    const types = "For-Dashboard";

    const getStats = async () => {
      try {
        const data = await fetchStats(types);

        // Convert object from backend into array for map
        const statsArray = [
          {
            label: "Total Pages",
            value: data.totalPages ?? 0,
            icon: FileText,
            change: "+3 this week",
            color: "text-blue-600",
          },
          {
            label: "Published Pages",
            value: data.publishedPages ?? 0,
            icon: BarChart3,
            change: "+12 this week",
            color: "text-green-600",
          },
          {
            label: "Draft Pages",
            value: data.draftPages ?? 0,
            icon: ImageIcon,
            change: "+5 this week",
            color: "text-purple-600",
          },
        ];

        setStats(statsArray);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    getStats();

    const interval = setInterval(getStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingChanges = [
    {
      type: "Menu",
      name: "Main Navigation",
      editor: "Sarah K.",
      time: "2 hours ago",
      status: "draft",
    },
    {
      type: "Footer",
      name: "Site Footer",
      editor: "Mike R.",
      time: "5 hours ago",
      status: "draft",
    },
  ];

  const recentActivity = [
    { action: "Published page", item: "About Us", user: "Sarah K.", time: "10 min ago" },
    { action: "Updated menu", item: "Products Menu", user: "Mike R.", time: "1 hour ago" },
    { action: "Uploaded media", item: "hero-banner.jpg", user: "Admin", time: "2 hours ago" },
    { action: "Created page", item: "Services", user: "Sarah K.", time: "3 hours ago" },
  ];

  if (loading)
    return <p className="text-center text-muted-foreground mt-8">Loading dashboard...</p>;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-balance text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-pretty text-muted-foreground mt-2">
          Here's what's happening with your website.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* 
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
       
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Pending Changes
            </CardTitle>
            <CardDescription>Changes awaiting review or publish</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingChanges.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pending changes</p>
            ) : (
              <div className="space-y-4">
                {pendingChanges.map((change, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="font-medium text-sm">{change.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          {change.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {change.editor} • {change.time}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium wrap-break-word">{activity.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 bg-transparent"
            >
              <Link href="/cms/content/pages/new">
                <FileText className="h-5 w-5" />
                <span className="text-xs sm:text-sm">New Page</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 bg-transparent"
            >
              <Link href="/cms/content/blog/new">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs sm:text-sm">New Post</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 bg-transparent"
            >
              <Link href="/cms/media">
                <ImageIcon className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Media</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 bg-transparent"
            >
              <Link href="/cms/global/menus">
                <Globe className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Edit Menu</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
