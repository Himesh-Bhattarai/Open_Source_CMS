"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Save,
  Eye,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  History,
  Check,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PreviewModal } from "@/components/cms/preview-modal"
import { PublishModal } from "@/components/cms/publish-modal"

const versions = [
  { id: 1, date: "2024-12-01", status: "draft", user: "John Doe", changes: "Initial draft" },
  { id: 2, date: "2024-12-05", status: "published", user: "Sarah K.", changes: "Added content" },
]

export default function PageEditor() {
  const params = useParams()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showPublish, setShowPublish] = useState(false)

  const [pageData, setPageData] = useState({
    title: "About Us",
    slug: "about",
    content: "Welcome to our company. We are dedicated to providing excellent service...",
    status: "published",
    publishedAt: "2025-01-15",
    author: "Sarah K.",
    seo: {
      metaTitle: "About Us - Learn About Our Company",
      metaDescription: "Discover our story, mission, and the team behind our success.",
      focusKeyword: "about us",
    },
    settings: {
      featured: false,
      allowComments: true,
      template: "default",
    },
  })

  // Auto-save simulation
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        setIsSaving(true)
        setTimeout(() => {
          setIsSaving(false)
          setLastSaved(new Date())
          setIsDirty(false)
        }, 500)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isDirty, pageData])

  const handleChange = (field: string, value: any) => {
    setPageData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setPageData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent as keyof typeof prev], [field]: value },
    }))
    setIsDirty(true)
  }

  const handlePublish = (type: "now" | "schedule", date?: string, time?: string) => {
    setIsSaving(true)
    setTimeout(() => {
      setPageData((prev) => ({ ...prev, status: type === "now" ? "published" : "scheduled" }))
      setIsSaving(false)
      setLastSaved(new Date())
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cms/content/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-balance text-2xl font-bold tracking-tight">{pageData.title}</h1>
            <Badge variant={pageData.status === "published" ? "default" : "secondary"}>{pageData.status}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span>/{pageData.slug}</span>
            <span>•</span>
            <span>Last edited by {pageData.author}</span>
            {lastSaved && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {isSaving ? (
                    <>
                      <Clock className="h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      Saved {lastSaved.toLocaleTimeString()}
                    </>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowVersions(!showVersions)}>
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {pageData.status === "draft" && (
            <Button onClick={() => setShowPublish(true)} disabled={isSaving}>
              <Globe className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}
          {pageData.status === "published" && (
            <Button variant="outline" onClick={() => setShowPublish(true)} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Update
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={pageData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">yoursite.com/</span>
                  <Input
                    id="slug"
                    value={pageData.slug}
                    onChange={(e) => handleChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  />
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/${pageData.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={pageData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {pageData.content.length} characters • {pageData.content.split(" ").length} words
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Section */}
          <Card>
            <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
              <CardHeader className="cursor-pointer" onClick={() => setSeoOpen(!seoOpen)}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <CardTitle>SEO Settings</CardTitle>
                    {pageData.seo.metaTitle && pageData.seo.metaDescription ? (
                      <Badge variant="default" className="bg-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Optimized
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Needs attention
                      </Badge>
                    )}
                  </div>
                  {seoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CardDescription>Optimize your page for search engines</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={pageData.seo.metaTitle}
                      onChange={(e) => handleNestedChange("seo", "metaTitle", e.target.value)}
                      placeholder="Enter meta title"
                    />
                    <p className="text-xs text-muted-foreground">
                      {pageData.seo.metaTitle.length}/60 characters (optimal: 50-60)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={pageData.seo.metaDescription}
                      onChange={(e) => handleNestedChange("seo", "metaDescription", e.target.value)}
                      placeholder="Enter meta description"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {pageData.seo.metaDescription.length}/160 characters (optimal: 150-160)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="focusKeyword">Focus Keyword</Label>
                    <Input
                      id="focusKeyword"
                      value={pageData.seo.focusKeyword}
                      onChange={(e) => handleNestedChange("seo", "focusKeyword", e.target.value)}
                      placeholder="e.g., content management system"
                    />
                  </div>

                  <Separator />

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm font-medium mb-2">Search Preview</p>
                    <div className="space-y-1">
                      <p className="text-sm text-primary font-medium">{pageData.seo.metaTitle || pageData.title}</p>
                      <p className="text-xs text-green-700 dark:text-green-400">yoursite.com/{pageData.slug}</p>
                      <p className="text-sm text-muted-foreground">
                        {pageData.seo.metaDescription || "No meta description set"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
              <CardHeader className="cursor-pointer" onClick={() => setSettingsOpen(!settingsOpen)}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <CardTitle>Advanced Settings</CardTitle>
                  {settingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Featured Page</p>
                      <p className="text-xs text-muted-foreground">Show in featured sections</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pageData.settings.featured}
                      onChange={(e) => handleNestedChange("settings", "featured", e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Allow Comments</p>
                      <p className="text-xs text-muted-foreground">Enable user comments</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pageData.settings.allowComments}
                      onChange={(e) => handleNestedChange("settings", "allowComments", e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template">Page Template</Label>
                    <select
                      id="template"
                      value={pageData.settings.template}
                      onChange={(e) => handleNestedChange("settings", "template", e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-background"
                    >
                      <option value="default">Default</option>
                      <option value="full-width">Full Width</option>
                      <option value="sidebar">With Sidebar</option>
                      <option value="landing">Landing Page</option>
                    </select>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={pageData.status === "published" ? "default" : "secondary"} className="capitalize">
                    {pageData.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={pageData.publishedAt}
                  onChange={(e) => handleChange("publishedAt", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Author</Label>
                <p className="text-sm text-muted-foreground">{pageData.author}</p>
              </div>
            </CardContent>
          </Card>

          {showVersions && (
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>Restore previous versions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {versions.map((version) => (
                    <div key={version.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{version.date}</p>
                            <Badge variant="secondary" className="text-xs">
                              {version.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{version.user}</p>
                          <p className="text-xs text-muted-foreground mt-1">{version.changes}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Restore
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href={`/${pageData.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Page
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Changes
              </Button>
              <Separator />
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Delete Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={pageData}
        previewUrl={`/${pageData.slug}`}
      />

      <PublishModal
        isOpen={showPublish}
        onClose={() => setShowPublish(false)}
        onPublish={handlePublish}
        content={pageData}
      />
    </div>
  )
}
