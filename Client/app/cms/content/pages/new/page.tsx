"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createPage, checkSlugAvailability } from "@/Api/Page/CreatePage"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash,
  Lock,
  Shield,
  Hash,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTenant } from "@/context/TenantContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { PageType, Visibility } from "@/lib/types/page"

export default function NewPageEditor() {
  const router = useRouter()
  const { tenants } = useTenant()
  const [selectedTenantId, setSelectedTenantId] = useState("")
  const [slugValidation, setSlugValidation] = useState({
    isValid: true,
    message: "",
    isChecking: false
  })

  const [page, setPage] = useState({
    title: "",
    slug: "",
    blocks: [] as any[],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [] as string[],
      ogImage: "",
      noIndex: false,
      // Extended fields
      canonicalUrl: "",
      robots: {
        index: true,
        follow: true,
        maxImagePreview: "standard" as const,
      },
      openGraph: {
        title: "",
        description: "",
        image: "",
        type: "website" as const,
      },
      twitter: {
        card: "summary_large_image" as const,
        title: "",
        description: "",
        image: "",
      },
      structuredData: {},
      sitemapInclusion: true,
    },
    status: "draft" as const,
    settings: {
      pageType: "default" as PageType,
      visibility: "public" as Visibility,
      featured: false,
      allowComments: true,
      template: "default",
      authorId: "current-user-id", // Should be from auth context
      parentId: undefined as string | undefined,
      isHomepage: false,
    }
  })

  const handleTitleChange = async (title: string) => {
    const newSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-_]/g, "")

    setPage(prev => ({
      ...prev,
      title,
      slug: newSlug,
    }))

    // Check slug availability
    if (selectedTenantId && newSlug) {
      setSlugValidation(prev => ({ ...prev, isChecking: true }))
      const available = await checkSlugAvailability(selectedTenantId, newSlug)
      setSlugValidation({
        isValid: available,
        message: available ? "" : "This slug is already in use",
        isChecking: false
      })
    }
  }

  const handleSlugChange = async (newSlug: string) => {
    const formattedSlug = newSlug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-_]/g, "")

    setPage(prev => ({
      ...prev,
      slug: formattedSlug
    }))

    if (selectedTenantId && formattedSlug) {
      setSlugValidation(prev => ({ ...prev, isChecking: true }))
      const available = await checkSlugAvailability(selectedTenantId, formattedSlug)
      setSlugValidation({
        isValid: available,
        message: available ? "" : "This slug is already in use",
        isChecking: false
      })
    }
  }

  const addBlock = (type: string) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      order: page.blocks.length + 1,
      data: {},
      schemaVersion: "1.0",
      // Initialize with schema defaults
      ...(type === "hero" && {
        data: { heading: "", subheading: "", backgroundImage: "", ctaText: "", ctaLink: "" }
      }),
      ...(type === "text" && {
        data: { heading: "", body: "", alignment: "left", textSize: "medium" }
      }),
      ...(type === "features" && {
        data: { title: "", items: [] }
      }),
      // ... other block types
    }

    setPage(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }))
  }

  const updateBlock = (id: string, data: any) => {
    setPage(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === id ? {
          ...b,
          data: { ...b.data, ...data },
          // Add validation if needed
          validationErrors: validateBlockData(b.type, { ...b.data, ...data })
        } : b
      )
    }))
  }

  const validateBlockData = (type: string, data: any): string[] => {
    const errors: string[] = []

    switch (type) {
      case "hero":
        if (!data.heading?.trim()) errors.push("Heading is required")
        break
      case "text":
        if (!data.body?.trim()) errors.push("Content is required")
        break
      case "features":
        if (!Array.isArray(data.items)) errors.push("Items must be an array")
        break
    }

    return errors
  }

  const handleCreate = async () => {
    if (!slugValidation.isValid) {
      alert("Please fix slug validation errors before creating")
      return
    }

    try {
      const pageData = {
        tenantId: selectedTenantId,
        title: page.title,
        slug: page.slug,
        blocks: page.blocks.map(block => ({
          id: block.id,
          type: block.type,
          order: block.order,
          data: block.data,
          schemaVersion: block.schemaVersion,
          // Preserve any additional fields
          ...Object.keys(block)
            .filter(key => !['id', 'type', 'order', 'data', 'schemaVersion'].includes(key))
            .reduce((obj, key) => ({ ...obj, [key]: block[key] }), {})
        })),
        seo: page.seo,
        status: page.status,
        settings: page.settings,
        // Initialize production fields
        slugHistory: [],
        currentVersion: 1,
        versions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastModifiedBy: "current-user-id",
        lastModifiedAt: new Date(),
        isLocked: false,
        etag: crypto.randomUUID(),
        lastSavedHash: "",
        authorId: "current-user-id",
        author: "Current User" // Should be from auth context
      }

      console.log("CREATE PAGE PAYLOAD:", pageData)

      const createdPage = await createPage(pageData)
      console.log("CREATED PAGE:", createdPage)

      router.push(`/cms/content/pages/${createdPage.pageId}`)
    } catch (error) {
      console.error("Failed to create page:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cms/content/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">New Page</h1>
          <p className="text-muted-foreground">
            Create structured CMS pages with production features
          </p>
        </div>

        <Button
          onClick={handleCreate}
          disabled={!page.title || !selectedTenantId || !slugValidation.isValid}
        >
          <Save className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>

      {/* Validation alert */}
      {!slugValidation.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Slug validation failed: {slugValidation.message}
          </AlertDescription>
        </Alert>
      )}

      {/* PAGE META */}
      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tenant selection */}
          <div className="space-y-2">
            <Label>Choose Website</Label>
            <Select
              value={selectedTenantId}
              onValueChange={(value) => setSelectedTenantId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a website" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant._id} value={tenant._id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={page.title}
              disabled={!selectedTenantId}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter page title"
            />
          </div>

          {/* Slug */}
          <div>
            <Label>Slug</Label>
            <div className="flex items-center gap-2">
              <Input
                value={page.slug}
                disabled={!selectedTenantId}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="url-slug"
              />
              {slugValidation.isChecking && (
                <span className="text-xs text-muted-foreground">Checking availability...</span>
              )}
            </div>
          </div>

          {/* Page Type and Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageType">
                <Hash className="h-4 w-4 inline mr-2" />
                Page Type
              </Label>
              <Select
                value={page.settings.pageType}
                onValueChange={(value: PageType) =>
                  setPage(prev => ({
                    ...prev,
                    settings: { ...prev.settings, pageType: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Page</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="system">System Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">
                <Shield className="h-4 w-4 inline mr-2" />
                Visibility
              </Label>
              <Select
                value={page.settings.visibility}
                onValueChange={(value: Visibility) =>
                  setPage(prev => ({
                    ...prev,
                    settings: { ...prev.settings, visibility: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="auth-only">Authenticated Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-2">
            <Label>SEO Settings</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Index in Search</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={page.seo.robots.index}
                    onCheckedChange={(checked) =>
                      setPage(prev => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          robots: { ...prev.seo.robots, index: checked }
                        }
                      }))
                    }
                  />
                  <span className="text-sm">
                    {page.seo.robots.index ? "Index" : "Noindex"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Sitemap</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={page.seo.sitemapInclusion}
                    onCheckedChange={(checked) =>
                      setPage(prev => ({
                        ...prev,
                        seo: { ...prev.seo, sitemapInclusion: checked }
                      }))
                    }
                  />
                  <span className="text-sm">
                    {page.seo.sitemapInclusion ? "Include" : "Exclude"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CONTENT BUILDER - Enhanced with validation */}
      <Card>
        <CardHeader>
          <CardTitle>Content Blocks</CardTitle>
          <p className="text-sm text-muted-foreground">
            {page.blocks.length} blocks • Use schema-driven blocks for consistent content
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {page.blocks.map(block => (
            <div
              key={block.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {block.type.toUpperCase()} (#{block.order})
                </div>
                {block.validationErrors?.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {block.validationErrors.length} errors
                  </Badge>
                )}
              </div>

              {/* Existing block editors with validation */}
              {block.type === "hero" && (
                <>
                  <Input
                    placeholder="Heading *"
                    value={block.data.heading || ""}
                    onChange={e =>
                      updateBlock(block.id, {
                        heading: e.target.value,
                      })
                    }
                    className={!block.data.heading ? "border-red-300" : ""}
                  />
                  {/* Other fields... */}
                </>
              )}

              {/* Add block-level validation feedback */}
              {block.validationErrors?.map((error, idx) => (
                <p key={idx} className="text-xs text-red-500">
                  • {error}
                </p>
              ))}

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => {
                  setPage(prev => ({
                    ...prev,
                    blocks: prev.blocks.filter(b => b.id !== block.id)
                      .map((b, i) => ({ ...b, order: i + 1 }))
                  }))
                }}
              >
                <Trash className="h-4 w-4 mr-1" />
                Remove block
              </Button>
            </div>
          ))}

          {/* ADD BLOCKS */}
          <div className="flex flex-wrap gap-2">
            {[
              { type: "hero", label: "Hero", icon: "🏆" },
              { type: "text", label: "Text", icon: "📝" },
              { type: "features", label: "Features", icon: "✨" },
              { type: "gallery", label: "Gallery", icon: "🖼️" },
              { type: "cta", label: "CTA", icon: "🎯" },
              { type: "testimonials", label: "Testimonials", icon: "💬" },
              { type: "team", label: "Team", icon: "👥" },
              { type: "contact", label: "Contact", icon: "📞" },
              { type: "custom", label: "Custom", icon: "⚙️" },
            ].map(({ type, label, icon }) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => addBlock(type)}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}