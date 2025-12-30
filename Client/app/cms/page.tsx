"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Globe, ImageIcon, Settings, Users, Clock, AlertTriangle, Building2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CMSDashboard() {
  const router = useRouter();
  const { user, loading, isAdmin, isImpersonating, impersonatedTenant } = useAuth();
  console.log(user, loading, isAdmin, isImpersonating, impersonatedTenant);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return null; // or spinner
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (isAdmin && !isImpersonating) {
    return <AdminDashboard />;
  }

  return (
    <OwnerDashboard
      user={user}
      tenantName={impersonatedTenant?.name || user?.tenantName}
    />
  );
}
function AdminDashboard() {
  const stats = [
    { label: "Total Websites", value: "12", icon: Building2, change: "+2 this month", color: "text-blue-600" },
    { label: "Total Users", value: "48", icon: Users, change: "+5 this week", color: "text-green-600" },
    { label: "Total Pages", value: "324", icon: FileText, change: "Across all sites", color: "text-purple-600" },
    { label: "Storage Used", value: "2.4 GB", icon: ImageIcon, change: "24% of plan", color: "text-orange-600" },
  ]

  const recentTenants = [
    { name: "ACME Corporation", domain: "acme.example.com", status: "active", users: 5, pages: 24 },
    { name: "TechStart Inc", domain: "techstart.example.com", status: "active", users: 3, pages: 12 },
    { name: "Green Earth Co", domain: "greenearth.example.com", status: "trial", users: 2, pages: 8 },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-balance text-3xl sm:text-4xl font-bold tracking-tight">Platform Dashboard</h1>
          <p className="text-pretty text-muted-foreground mt-2">Manage all websites and platform settings</p>
        </div>
        <Button asChild>
          <Link href="/cms/tenants">View All Websites</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Tenants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Building2 className="h-5 w-5" />
            Recent Websites
          </CardTitle>
          <CardDescription>Latest website activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTenants.map((tenant) => (
              <div
                key={tenant.domain}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{tenant.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        tenant.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tenant.domain}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{tenant.users} users</span>
                    <span>{tenant.pages} pages</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Link href={`/cms/tenants/${tenant.domain}`}>Manage</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Platform Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Link href="/cms/tenants">
                <Building2 className="h-5 w-5" />
                <span className="text-xs sm:text-sm">All Websites</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Link href="/cms/users">
                <Users className="h-5 w-5" />
                <span className="text-xs sm:text-sm">All Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Link href="/cms/settings">
                <Settings className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Platform Settings</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Link href="/cms/tenants">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OwnerDashboard({ user, tenantName }: { user: any; tenantName?: string }) {
  const stats = [
    { label: "Total Pages", value: "24", icon: FileText, change: "+3 this week", color: "text-blue-600" },
    { label: "Published Posts", value: "156", icon: BarChart3, change: "+12 this week", color: "text-green-600" },
    { label: "Media Files", value: "842", icon: ImageIcon, change: "+45 this week", color: "text-purple-600" },
    { label: "Team Members", value: "5", icon: Users, change: "1 online now", color: "text-orange-600" },
  ]

  const pendingChanges = [
    { type: "Menu", name: "Main Navigation", editor: "Sarah K.", time: "2 hours ago", status: "draft" },
    { type: "Footer", name: "Site Footer", editor: "Mike R.", time: "5 hours ago", status: "draft" },
  ]

  const recentActivity = [
    { action: "Published page", item: "About Us", user: "Sarah K.", time: "10 min ago" },
    { action: "Updated menu", item: "Products Menu", user: "Mike R.", time: "1 hour ago" },
    { action: "Uploaded media", item: "hero-banner.jpg", user: "Admin", time: "2 hours ago" },
    { action: "Created page", item: "Services", user: "Sarah K.", time: "3 hours ago" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-balance text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-pretty text-muted-foreground mt-2">
          {tenantName ? `Managing ${tenantName}` : "Here's what's happening with your website."}
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Pending Global Changes */}
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

        {/* Recent Activity */}
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
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Link href="/cms/content/pages/new">
                <FileText className="h-5 w-5" />
                <span className="text-xs sm:text-sm">New Page</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Link href="/cms/content/blog/new">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs sm:text-sm">New Post</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Link href="/cms/media">
                <ImageIcon className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Media</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
              <Link href="/cms/global/menus">
                <Globe className="h-5 w-5" />
                <span className="text-xs sm:text-sm">Edit Menu</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
