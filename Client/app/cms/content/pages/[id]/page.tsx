"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  Lock,
  Unlock,
  Shield,
  Users,
  GitBranch,
  Hash,
  Code,
  Search,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PreviewModal } from "@/components/cms/preview-modal"
import { PublishModal } from "@/components/cms/publish-modal"
import { useTenant } from "@/context/TenantContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { getUserPage as getPage} from "@/Api/Page/Fetch"
import { checkSlugAvailability } from "@/Api/Page/Services"
// Added checkSlugAvailability import
import { createPageVersion, updatePage } from "@/Api/Page/CreatePage"
import { restorePageVersion } from "@/Api/Page/Services"
import type { Page, PageVersion, BlockType, Visibility, PageType } from "@/lib/types/page"

// Add this interface for slug history tracking
interface SlugHistoryItem {
  slug: string;
  changedAt: Date;
  changedBy: string;
  redirectEnabled: boolean;
}

export default function PageEditor() {
  const params = useParams()
  const router = useRouter()
  const { tenants, selectedTenantId } = useTenant()
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [slugHistory, setSlugHistory] = useState<SlugHistoryItem[]>([])
  const [slugValidation, setSlugValidation] = useState({
    isValid: true,
    message: "",
    isChecking: false
  })
  const [pageVersions, setPageVersions] = useState<PageVersion[]>([])
  const [isLocked, setIsLocked] = useState(false)
  const [lockedBy, setLockedBy] = useState<string | null>(null)
  const [etag, setEtag] = useState("")
  const originalSlugRef = useRef<string>("") // Track original slug

  // Safely extract pageId from params
  const getPageId = () => {
    const id = params.id;
    if (!id) return "";
    if (Array.isArray(id)) return id[0] || "";
    return id;
  };

  const pageId = getPageId();
  if (!selectedTenantId) {
    return <div>Loading tenant…</div>;
  }

  // Extended page data with production fields
  const [pageData, setPageData] = useState<Page>(() => ({
    _id: pageId,
    tenantId: selectedTenantId,
    title: "About Us",
    slug: "about",
    content: "Welcome to our company. We are dedicated to providing excellent service...",
    blocks: [] as any[],
    status: "published" as const,
    publishedAt: "2025-01-15",
    author: "Sarah K.",
    authorId: "user-123",
    seo: {
      metaTitle: "About Us - Learn About Our Company",
      metaDescription: "Discover our story, mission, and the team behind our success.",
      focusKeyword: "about us",
      canonicalUrl: "",
      robots: {
        index: true,
        follow: true,
        maxImagePreview: "standard" as const,
        maxSnippet: -1,
        maxVideoPreview: -1
      },
      openGraph: {
        title: "",
        description: "",
        image: "",
        type: "website" as const
      },
      twitter: {
        card: "summary_large_image" as const,
        title: "",
        description: "",
        image: "",
        site: "@contentflow"
      },
      structuredData: {},
      sitemapInclusion: true,
      noIndexReasons: [] as string[]
    },
    settings: {
      featured: false,
      allowComments: true,
      template: "default",
      pageType: "default" as PageType,
      visibility: "public" as Visibility,
      locked: undefined,
      authorId: "user-123",
      parentId: undefined,
      redirectFrom: [] as string[],
      isHomepage: false,
      order: 0,
      publishedVersionId: undefined
    },
    slugHistory: [] as SlugHistoryItem[],
    currentVersion: 1,
    versions: [] as PageVersion[],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastModifiedBy: "Sarah K.",
    lastModifiedAt: new Date(),
    isLocked: false,
    lockedBy: undefined,
    lockedAt: undefined,
    etag: crypto.randomUUID(),
    lastSavedHash: ""
  }));

  // Load page data on mount
  useEffect(() => {
    if (pageId) {
      loadPageData(pageId)
    }
  }, [pageId])

  // Auto-save with conflict detection
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        autoSave()
      }, 5000) // Auto-save after 5 seconds of inactivity
      return () => clearTimeout(timer)
    }
  }, [isDirty, pageData])


  const loadPageData = async (pageId: string) => {
    try {
      const data = await getPage(pageId) // Fixed: Pass pageId parameter
      setPageData(data)
      setSlugHistory(data.slugHistory || [])
      originalSlugRef.current = data.slug // Track original slug
      setPageVersions(data.versions || [])
      setIsLocked(data.isLocked || false)
      setLockedBy(data.lockedBy || null)
      setEtag(data.etag || "")
    } catch (error) {
      console.error("Failed to load page:", error)
      toast.error("Failed to load page data")
    }
  }

  // Slug validation function
  const validateSlug = async (slug: string) => {
    if (!slug.trim()) {
      setSlugValidation({
        isValid: false,
        message: "Slug cannot be empty",
        isChecking: false
      });
      return false;
    }

    // Basic validation
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      setSlugValidation({
        isValid: false,
        message: "Slug can only contain lowercase letters, numbers, and hyphens",
        isChecking: false
      });
      return false;
    }

    setSlugValidation(prev => ({ ...prev, isChecking: true }));

    try {
      const result = await checkSlugAvailability(slug, selectedTenantId);
      setSlugValidation({
        isValid: result.available,
        message: result.available ? "Slug is available" : "Slug is already in use",
        isChecking: false
      });
      return result.available;
    } catch (error) {
      console.error("Slug validation error:", error);
      setSlugValidation({
        isValid: false,
        message: "Error checking slug availability",
        isChecking: false
      });
      return false;
    }
  };

  const autoSave = async () => {
    if (!isDirty || isSaving) return

    setIsSaving(true)
    try {
      const saveData = prepareSaveData(true) // Pass autoSave flag
      await updatePage({ data: saveData, options: { autoSave: true } })

      // Create version snapshot for auto-save
      await createPageVersion({
        pageId: pageData._id,
        data: pageData,
        createdBy: "auto-save",
        changes: ["Auto-save"],
        autoSave: true
      })

      setLastSaved(new Date())
      setIsDirty(false)
      setEtag(crypto.randomUUID()) // Update etag on save
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Conflict detected. Page was modified by someone else.")
        // Refresh page data
        await loadPageData(pageData._id)
      }
      console.error("Auto-save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const prepareSaveData = (isAutoSave = false) => {
    // Update noIndex reasons based on page state
    const noIndexReasons: string[] = []
    if (pageData.status as string === 'draft') noIndexReasons.push('draft')
    if (pageData.seo.robots.index === false) noIndexReasons.push('manual-noindex')
    if (pageData.settings.visibility === 'private') noIndexReasons.push('private-page')

    // Only add slug history entry if slug actually changed from original and not during autoSave
    const shouldAddSlugHistory = !isAutoSave &&
      originalSlugRef.current &&
      originalSlugRef.current !== pageData.slug &&
      originalSlugRef.current !== "";

    const saveData = {
      ...pageData,
      seo: {
        ...pageData.seo,
        noIndexReasons,
        // Ensure canonical URL is absolute
        canonicalUrl: pageData.seo.canonicalUrl
          ? pageData.seo.canonicalUrl.startsWith('http')
            ? pageData.seo.canonicalUrl
            : `https://${pageData.seo.canonicalUrl}`
          : undefined
      },
      // Update slug history only if slug actually changed and not during autoSave
      slugHistory: shouldAddSlugHistory ? [
        ...pageData.slugHistory,
        {
          slug: originalSlugRef.current,
          changedAt: new Date(),
          changedBy: "Current User", // Replace with actual user
          redirectEnabled: true
        }
      ] : pageData.slugHistory,
      updatedAt: new Date(),
      lastModifiedAt: new Date(),
      lastModifiedBy: "Current User", // Replace with actual user
      etag // Include current etag for conflict detection
    }

    return saveData
  }

  const handleSave = async (publishOptions?: any) => {
    if (!slugValidation.isValid) {
      toast.error("Please fix slug validation errors before saving")
      return
    }

    // Validate slug before saving
    const isValidSlug = await validateSlug(pageData.slug);
    if (!isValidSlug) {
      toast.error("Please fix slug validation errors before saving");
      return;
    }

    setIsSaving(true)
    try {
      const saveData = prepareSaveData(false) // Not autoSave

      // Check for conflicts
      const response = await updatePage({ data: saveData, options: {} })

      // Create version snapshot
      await createPageVersion({
        pageId: pageData._id,
        data: pageData,
        createdBy: "user-save", // Replace with actual user
        changes: ["Manual save"],
        autoSave: false
      })

      // Update original slug reference after successful save
      originalSlugRef.current = pageData.slug;

      setLastSaved(new Date())
      setIsDirty(false)
      setEtag(response.etag)

      if (publishOptions) {
        handlePublish(publishOptions.type, publishOptions.date, publishOptions.time)
      }

      toast.success("Page saved successfully")
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Conflict detected. Page was modified by someone else.")
        // Refresh page data
        await loadPageData(pageData._id)
      } else {
        console.error("Save failed:", error)
        toast.error("Failed to save page")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleSlugChange = (newSlug: string) => {
    const formattedSlug = newSlug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-_]/g, "")

    setPageData(prev => ({ ...prev, slug: formattedSlug }))
    setIsDirty(true)

    // Validate slug
    validateSlug(formattedSlug);

    // Check if slug changed significantly from original
    if (originalSlugRef.current && originalSlugRef.current !== formattedSlug) {
      // Prompt to enable 301 redirect
      toast.info("Slug changed. 301 redirect will be created from old URL.", {
        action: {
          label: "Configure",
          onClick: () => {
            // Open redirect settings
            console.log("Configure redirects")
          }
        }
      })
    }
  }


  const handleLock = async () => {
    try {
      await updatePage({
        data: {
          ...pageData,
          isLocked: true,
          lockedBy: "current-user-id", // Replace with actual user
          lockedAt: new Date()
        },
        options: {} // Add any necessary options
      })
      setIsLocked(true)
      setLockedBy("current-user-id")
      toast.success("Page locked")
    } catch (error) {
      toast.error("Failed to lock page")
    }
  }

  const handleUnlock = async () => {
    try {
      await updatePage({
        data: {
          isLocked: false,
          lockedBy: null,
          lockedAt: null
        },
        options: {} // Add any necessary options
      })
      setIsLocked(false)
      setLockedBy(null)
      toast.success("Page unlocked")
    } catch (error) {
      toast.error("Failed to unlock page")
    }
  }

  const handleRestoreVersion = async (versionId: string) => {
    try {
      const restoredData = await restorePageVersion(versionId)
      setPageData(restoredData)
      setIsDirty(true)
      toast.success("Version restored")
    } catch (error) {
      toast.error("Failed to restore version")
    }
  }

  const handlePublish = async (type: "now" | "schedule", date?: string, time?: string) => {
    setIsSaving(true)
    try {
      
      const publishData = {
        ...pageData,
        status: type === "now" ? "published" : "scheduled" as "published",
        publishedAt: type === "now" ? new Date().toISOString() : `${date}T${time}`,
        settings: {
          ...pageData.settings,
          publishedVersionId: pageData._id  // Link to current version
        }
      };

      await updatePage({data:publishData, options: {}}) // Update page data with publishData)

      setPageData(publishData)
      setLastSaved(new Date())
      setIsDirty(false)

      toast.success(type === "now" ? "Page published" : "Page scheduled")
    } catch (error) {
      console.error("Publish failed:", error)
      toast.error("Failed to publish page")
    } finally {
      setIsSaving(false)
    }
  }

  const generateSEOPreview = () => {
    const title = pageData.seo.metaTitle || pageData.title
    const description = pageData.seo.metaDescription || pageData.content.substring(0, 160)
    const canonical = pageData.seo.canonicalUrl || `/${pageData.slug}`

    return `
      <title>${title}</title>
      <meta name="description" content="${description}">
      <meta name="robots" content="${pageData.seo.robots.index ? 'index' : 'noindex'},${pageData.seo.robots.follow ? 'follow' : 'nofollow'}">
      <link rel="canonical" href="${canonical}">
      
      <!-- Open Graph -->
      <meta property="og:title" content="${pageData.seo.openGraph?.title || title}">
      <meta property="og:description" content="${pageData.seo.openGraph?.description || description}">
      <meta property="og:image" content="${pageData.seo.openGraph?.image || ''}">
      <meta property="og:type" content="${pageData.seo.openGraph?.type || 'website'}">
      <meta property="og:url" content="${canonical}">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="${pageData.seo.twitter?.card || 'summary_large_image'}">
      <meta name="twitter:title" content="${pageData.seo.twitter?.title || title}">
      <meta name="twitter:description" content="${pageData.seo.twitter?.description || description}">
      <meta name="twitter:image" content="${pageData.seo.twitter?.image || ''}">
      ${pageData.seo.twitter?.site ? `<meta name="twitter:site" content="${pageData.seo.twitter.site}">` : ''}
      
      <!-- Structured Data -->
      ${pageData.seo.structuredData ? `<script type="application/ld+json">${JSON.stringify(pageData.seo.structuredData)}</script>` : ''}
    `
  }

  const validateBlocks = () => {
    const errors: string[] = []

    pageData.blocks.forEach((block, index) => {
      // Basic validation - ensure each block has required fields
      if (!block.id || !block.type) {
        errors.push(`Block ${index + 1} missing required fields`)
      }
    })

    return errors
  }

  // Render function continues with existing JSX, but extended...
  // I'll show the critical additions

  return (
    <div className="space-y-6">
      {/* Header with lock status */}
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
            {isLocked && (
              <Badge variant="destructive">
                <Lock className="h-3 w-3 mr-1" />
                Locked by {lockedBy}
              </Badge>
            )}
            {pageData.settings.pageType !== "default" && (
              <Badge variant="outline">
                <Hash className="h-3 w-3 mr-1" />
                {pageData.settings.pageType}
              </Badge>
            )}
            {pageData.settings.visibility !== "public" && (
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                {pageData.settings.visibility}
              </Badge>
            )}
          </div>
          {/* Existing status bar... */}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowVersions(!showVersions)}>
            <History className="h-4 w-4 mr-2" />
            History ({pageVersions.length})
          </Button>
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {isLocked ? (
            <Button onClick={handleUnlock}>
              <Unlock className="h-4 w-4 mr-2" />
              Unlock
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLock}>
              <Lock className="h-4 w-4 mr-2" />
              Lock
            </Button>
          )}
          {/* Existing publish buttons... */}
        </div>
      </div>

      {/* Slug validation alert */}
      {!slugValidation.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Slug validation failed: {slugValidation.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Extend with new fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing title field... */}

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">yoursite.com/</span>
                  <Input
                    id="slug"
                    value={pageData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                  />
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/${pageData.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                {slugHistory.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Previous slugs: {slugHistory.map(s => s.slug).join(", ")}
                  </div>
                )}
              </div>

              {/* Add page type and visibility */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pageType">Page Type</Label>
                  <Select
                    value={pageData.settings.pageType}
                    onValueChange={(value: PageType) =>
                      setPageData(prev => ({
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
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={pageData.settings.visibility}
                    onValueChange={(value: Visibility) =>
                      setPageData(prev => ({
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

              {/* Existing content field... */}
            </CardContent>
          </Card>

          {/* Enhanced SEO Section */}
          <Card>
            <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
              <CardHeader className="cursor-pointer" onClick={() => setSeoOpen(!seoOpen)}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <CardTitle>SEO Settings</CardTitle>
                    <Badge variant="default" className="bg-blue-600">
                      <Search className="h-3 w-3 mr-1" />
                      Extended
                    </Badge>
                  </div>
                  {seoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CardDescription>Advanced SEO optimization</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="basic">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="robots">Robots</TabsTrigger>
                      <TabsTrigger value="social">Social</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      {/* Existing basic SEO fields... */}
                    </TabsContent>

                    <TabsContent value="robots" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Index in Search</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow search engines to index this page
                            </p>
                          </div>
                          <Switch
                            checked={pageData.seo.robots.index}
                            onCheckedChange={(checked) =>
                              setPageData(prev => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  robots: { ...prev.seo.robots, index: checked }
                                }
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Follow Links</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow search engines to follow links on this page
                            </p>
                          </div>
                          <Switch
                            checked={pageData.seo.robots.follow}
                            onCheckedChange={(checked) =>
                              setPageData(prev => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  robots: { ...prev.seo.robots, follow: checked }
                                }
                              }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Include in Sitemap</Label>
                          <Switch
                            checked={pageData.seo.sitemapInclusion}
                            onCheckedChange={(checked) =>
                              setPageData(prev => ({
                                ...prev,
                                seo: { ...prev.seo, sitemapInclusion: checked }
                              }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Will be excluded if set to noindex
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="font-medium">Open Graph</h4>
                        {/* Open Graph fields... */}

                        <h4 className="font-medium">Twitter Cards</h4>
                        {/* Twitter fields... */}
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="canonicalUrl">Canonical URL</Label>
                          <Input
                            id="canonicalUrl"
                            value={pageData.seo.canonicalUrl || ""}
                            onChange={(e) =>
                              setPageData(prev => ({
                                ...prev,
                                seo: { ...prev.seo, canonicalUrl: e.target.value }
                              }))
                            }
                            placeholder="https://example.com/canonical-path"
                          />
                          <p className="text-xs text-muted-foreground">
                            Leave empty to use page URL
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Structured Data (JSON-LD)</Label>
                          <Textarea
                            value={JSON.stringify(pageData.seo.structuredData || {}, null, 2)}
                            onChange={(e) => {
                              try {
                                const data = JSON.parse(e.target.value || "{}")
                                setPageData(prev => ({
                                  ...prev,
                                  seo: { ...prev.seo, structuredData: data }
                                }))
                              } catch (error) {
                                // Keep invalid JSON until fixed
                              }
                            }}
                            rows={6}
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Valid JSON-LD for structured data
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Version History with restore functionality */}
          {showVersions && (
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>Restore previous versions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pageVersions.map((version) => (
                    <div key={version.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              v{version.versionNumber} • {new Date(version.createdAt).toLocaleDateString()}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {version.autoSave ? "Auto-save" : "Manual"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{version.createdBy}</p>
                          <div className="mt-1">
                            {version.changes.map((change, idx) => (
                              <span key={idx} className="text-xs text-muted-foreground mr-2">
                                • {change}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleRestoreVersion(version.id)}
                        >
                          Restore
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Enhanced Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={pageData}
        previewUrl={`/${pageData.slug}`}
        seoPreview={generateSEOPreview()}
        environment="production" // Should be configurable
      />

      <PublishModal
        isOpen={showPublish}
        onClose={() => setShowPublish(false)}
        onPublish={handlePublish}
        content={pageData}
        validation={validateBlocks()}
      />
    </div>
  )
}