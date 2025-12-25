"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Globe, FileText, ImageIcon, Users, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function TenantDetailPage() {
  const params = useParams()
  const tenantId = params.id

  const tenant = {
    id: tenantId,
    name: "Acme Corporation",
    domain: "acme.example.com",
    status: "active",
  }

  const quickLinks = [
    {
      title: "Pages",
      description: "Manage website pages and content",
      icon: FileText,
      href: `/cms/tenants/${tenantId}/pages`,
      count: 24,
    },
    {
      title: "Media Library",
      description: "Upload and manage media files",
      icon: ImageIcon,
      href: `/cms/tenants/${tenantId}/media`,
      count: 842,
    },
    {
      title: "Users & Roles",
      description: "Manage team members and permissions",
      icon: Users,
      href: `/cms/tenants/${tenantId}/users`,
      count: 8,
    },
    {
      title: "Site Settings",
      description: "Configure theme, SEO, and global settings",
      icon: SettingsIcon,
      href: `/cms/tenants/${tenantId}/settings`,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cms/tenants">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Websites
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
          <Globe className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">{tenant.name}</h1>
          <p className="text-pretty text-muted-foreground">{tenant.domain}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quickLinks.map((link) => (
          <Card key={link.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <link.icon className="h-8 w-8 text-primary" />
                {link.count !== undefined && (
                  <span className="text-2xl font-bold text-muted-foreground">{link.count}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{link.title}</CardTitle>
              <CardDescription className="mb-4">{link.description}</CardDescription>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={link.href}>Manage {link.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
