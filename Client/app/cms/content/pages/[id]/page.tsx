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
  Search,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PreviewModal } from "@/components/cms/preview-modal"
import { PublishModal } from "@/components/cms/publish-modal"
import { useTenant } from "@/context/TenantContext"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { getPageById } from "@/Api/Page/Fetch"
import { checkSlugAvailability, restorePageVersion } from "@/Api/Page/Services"
import { createPageVersion, updatePage } from "@/Api/Page/CreatePage"
import type { Page, PageVersion, Visibility, PageType } from "@/lib/types/page"

interface SlugHistoryItem {
  slug: string;
  changedAt: Date;
  changedBy: string;
  redirectEnabled: boolean;
}

// Declare missing APIs that are required for production
import { useAuth } from "@/hooks/useAuth"   // adjust path to your project


export default function PageEditor() {
  const { user, loading } = useAuth()


  const params = useParams()
  const router = useRouter()
  const { selectedTenantId } = useTenant()

  // State declarations - ALL HOOKS AT TOP LEVEL
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
  const [structuredDataError, setStructuredDataError] = useState<string | null>(null)

  // Refs
  const originalSlugRef = useRef<string>("")
  const saveTimerRef = useRef<NodeJS.Timeout>(null)
  const initialLoadRef = useRef(false)
  const saveDataRef = useRef<any>(null)

  // Get page ID from params safely - NEVER use slug in routing
  const getPageId = useCallback(() => {
    const id = params.id
    if (!id) return ""
    if (Array.isArray(id)) return id[0] || ""
    return id
  }, [params.id])

  const pageId = getPageId()

  // Initialize with empty page structure - NEVER undefined
  const [pageData, setPageData] = useState<Page>({
    _id: pageId,
    tenantId: selectedTenantId || "",
    title: "",
    slug: "",
    content: "",
    blocks: [],
    status: "draft",
    publishedAt: "",
    authorId: "",
    author: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      canonicalUrl: "",
      robots: {
        index: true,
        follow: true,
        maxImagePreview: "standard",
        maxSnippet: -1,
        maxVideoPreview: -1
      },
      openGraph: {
        title: "",
        description: "",
        image: "",
        type: "website"
      },
      twitter: {
        card: "summary_large_image",
        title: "",
        description: "",
        image: "",
        site: ""
      },
      structuredData: {},
      sitemapInclusion: true,
      noIndexReasons: []
    },
    settings: {
      featured: false,
      allowComments: true,
      template: "default",
      pageType: "default",
      visibility: "public",
      locked: undefined,
      authorId: "",
      parentId: undefined,
      redirectFrom: [],
      isHomepage: false,
      order: 0,
      publishedVersionId: undefined
    },
    slugHistory: [],
    currentVersion: 1,
    versions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastModifiedBy: "",
    lastModifiedAt: new Date(),
    isLocked: false,
    lockedBy: undefined,
    lockedAt: undefined,
    etag: "",
    lastSavedHash: ""
  })

  // Load page data - fixed to prevent multiple loads
  useEffect(() => {
    if (!pageId) return

    loadPageData(pageId)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [pageId])


  // Auto-save effect with validation
  useEffect(() => {
    if (isDirty && !isSaving && !isLocked && slugValidation.isValid && !structuredDataError) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      saveTimerRef.current = setTimeout(() => {
        autoSave()
      }, 5000)
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [isDirty, isSaving, isLocked, slugValidation.isValid, structuredDataError])

  const loadPageData = async (pageId: string) => {
    try {
      const data = await getPageById(pageId)

      if (!data) {
        toast.error("Page not found")
        router.push("/cms/content/pages")
        return
      }

      // Validate server data structure
      if (!data._id || !data.tenantId) {
        throw new Error("Invalid page data from server")
      }

      setPageData(data)
      setSlugHistory(data.slugHistory || [])
      originalSlugRef.current = data.slug || ""
      setPageVersions(data.versions || [])
      const lock = data.settings?.locked
      setIsLocked(!!lock)
      setLockedBy(lock?.byUserId || null)

      setEtag(data.etag || "") // Store REAL server etag
      setIsDirty(false)

    } catch (error) {
      console.error("Failed to load page:", error)
      toast.error("Failed to load page data")
    }
  }

  // Validate slug with tenant context
  const validateSlug = async (slug: string): Promise<boolean> => {
    if (!slug.trim()) {
      setSlugValidation({
        isValid: false,
        message: "Slug cannot be empty",
        isChecking: false
      })
      return false
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      setSlugValidation({
        isValid: false,
        message: "Slug can only contain lowercase letters, numbers, and hyphens",
        isChecking: false
      })
      return false
    }

    // Don't check if slug hasn't changed
    if (slug === originalSlugRef.current) {
      setSlugValidation({
        isValid: true,
        message: "Slug unchanged",
        isChecking: false
      })
      return true
    }

    setSlugValidation(prev => ({ ...prev, isChecking: true }))

    try {
      // MUST include tenantId
      const result = await checkSlugAvailability(slug, selectedTenantId)
      setSlugValidation({
        isValid: result.available,
        message: result.available ? "Slug is available" : "Slug is already in use",
        isChecking: false
      })
      return result.available
    } catch (error) {
      console.error("Slug validation error:", error)
      setSlugValidation({
        isValid: false,
        message: "Error checking slug availability",
        isChecking: false
      })
      return false
    }
  }

  // Validate structured data JSON
  const validateStructuredData = (jsonString: string): boolean => {
    try {
      if (!jsonString.trim()) {
        setStructuredDataError(null)
        return true
      }

      const parsed = JSON.parse(jsonString)

      // Basic JSON-LD validation
      if (typeof parsed !== "object" || parsed === null) {
        setStructuredDataError("Structured data must be a valid JSON object")
        return false
      }

      if (!parsed["@context"] && !parsed["@type"]) {
        setStructuredDataError("Structured data should include @context and @type properties")
        return false
      }

      setStructuredDataError(null)
      return true
    } catch (error) {
      setStructuredDataError("Invalid JSON format")
      return false
    }
  }

  // Prepare save data - EXACT SAME object for both update and version
  const prepareSaveData = useCallback((isAutoSave = false): Page => {
    // Compute noIndexReasons
    const noIndexReasons: string[] = []
    if (pageData.status === 'draft') noIndexReasons.push('draft')
    if (pageData.seo.robots.index === false) noIndexReasons.push('manual-noindex')
    if (pageData.settings.visibility === 'private') noIndexReasons.push('private-page')

    // Determine if slug changed and should add history
    const shouldAddSlugHistory = !isAutoSave &&
      originalSlugRef.current &&
      originalSlugRef.current !== pageData.slug &&
      originalSlugRef.current !== ""

    // Normalize canonical URL
    let canonicalUrl = pageData.seo.canonicalUrl || ""
    if (canonicalUrl && !canonicalUrl.startsWith('http')) {
      canonicalUrl = canonicalUrl.startsWith('/')
        ? `https://example.com${canonicalUrl}`
        : `https://${canonicalUrl}`
    }

    // Build the save object
    const saveData: Page = {
      ...pageData,
      tenantId: selectedTenantId || pageData.tenantId,
      seo: {
        ...pageData.seo,
        noIndexReasons,
        canonicalUrl,
        structuredData: pageData.seo.structuredData || {}
      },
      slugHistory: shouldAddSlugHistory
        ? [
          ...pageData.slugHistory,
          {
            slug: originalSlugRef.current,
            changedAt: new Date(),
            changedBy: user?.name || "System",
            redirectEnabled: true
          }
        ]
        : pageData.slugHistory,
      updatedAt: new Date(),
      lastModifiedAt: new Date(),
      lastModifiedBy: user?.name || "System",
      etag // Always send current etag for conflict detection
    }

    // Store reference for version creation
    saveDataRef.current = saveData
    return saveData
  }, [pageData, selectedTenantId, user, etag])

  // Auto-save with validation
  const autoSave = async () => {
    // Block auto-save if conditions are not met
    if (!isDirty || isSaving || isLocked || !slugValidation.isValid || structuredDataError) {
      return
    }

    // Validate slug before auto-save
    const isValidSlug = await validateSlug(pageData.slug)
    if (!isValidSlug) {
      console.log("Auto-save blocked: invalid slug")
      return
    }

    setIsSaving(true)
    try {
      // Prepare data - same for update and version
      const saveData = prepareSaveData(true)

      // Update with server etag
      const response = await updatePage({
        data: saveData,
        options: { autoSave: true }
      })

      // Create version with EXACT same data
      await createPageVersion({
        pageId: pageData._id,
        data: saveDataRef.current, // Same object
        createdBy: user?.id || "auto-save",
        changes: ["Auto-save"],
        autoSave: true
      })

      // Update local state with server response
      setLastSaved(new Date())
      setIsDirty(false)
      setEtag(response.etag) // Use REAL server etag

    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Conflict detected. Page was modified by someone else.")
        await loadPageData(pageData._id)
      } else if (error.status === 423) {
        // Locked by another user
        toast.error("Page is locked by another user")
        await loadPageData(pageData._id)
      } else {
        console.error("Auto-save failed:", error)
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Manual save with full validation
  const handleManualSave = async () => {
    // Check locking - real enforcement
    if (isLocked && lockedBy !== user?.id) {
      toast.error(`Page is locked by ${lockedBy} and cannot be edited`)
      return
    }

    // Validate slug
    if (!slugValidation.isValid) {
      toast.error("Please fix slug validation errors before saving")
      return
    }

    const isValidSlug = await validateSlug(pageData.slug)
    if (!isValidSlug) {
      toast.error("Please fix slug validation errors before saving")
      return
    }

    // Validate structured data
    const structuredDataJson = JSON.stringify(pageData.seo.structuredData || {})
    if (!validateStructuredData(structuredDataJson)) {
      toast.error("Please fix structured data JSON errors before saving")
      return
    }

    setIsSaving(true)
    try {
      // Prepare data
      const saveData = prepareSaveData(false)

      // Update with server etag
      const response = await updatePage({
        data: saveData,
        options: {}
      })

      // Create version with EXACT same data
      await createPageVersion({
        pageId: pageData._id,
        data: saveDataRef.current, // Same object
        createdBy: user?.id || "user-save",
        changes: ["Manual save"],
        autoSave: false
      })

      // Update original slug reference
      originalSlugRef.current = pageData.slug

      // Update state
      setLastSaved(new Date())
      setIsDirty(false)
      setEtag(response.etag) // Use REAL server etag

      toast.success("Page saved successfully")
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Conflict detected. Page was modified by someone else.")
        await loadPageData(pageData._id)
      } else if (error.status === 423) {
        toast.error("Page is locked by another user")
        await loadPageData(pageData._id)
      } else {
        console.error("Save failed:", error)
        toast.error("Failed to save page")
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Handle slug change with proper validation
  const handleSlugChange = (newSlug: string) => {
    const formattedSlug = newSlug.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") // Removed _ from allowed characters

    setPageData(prev => ({ ...prev, slug: formattedSlug }))
    setIsDirty(true)

    // Validate slug
    validateSlug(formattedSlug)

    // Show redirect notification if slug changed
    if (originalSlugRef.current && originalSlugRef.current !== formattedSlug) {
      toast.info("Slug changed. 301 redirect will be created from old URL.", {
        duration: 5000,
        action: {
          label: "Configure",
          onClick: () => {
            // Open redirect settings modal
            console.log("Open redirect configuration")
          }
        }
      })
    }
  }

  // Real locking with server enforcement
  const handleLock = async () => {
    if (!user) {
      toast.error("User session required")
      return
    }

    try {
      const lockData = {
        ...pageData,
        isLocked: true,
        lockedBy: user.id,
        lockedAt: new Date(),
        etag // Send current etag
      }

      const response = await updatePage({
        data: lockData,
        options: {}
      })

      setIsLocked(true)
      setLockedBy(user.id)
      setEtag(response.etag)
      toast.success("Page locked")
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Page was modified while trying to lock")
        await loadPageData(pageData._id)
      } else {
        toast.error("Failed to lock page")
      }
    }
  }

  const handleUnlock = async () => {
    if (!user) {
      toast.error("User session required")
      return
    }

    // Only allow unlock if locked by current user
    if (lockedBy !== user.id) {
      toast.error(`Only ${lockedBy} can unlock this page`)
      return
    }

    try {
      const unlockData = {
        ...pageData,
        isLocked: false,
        lockedBy: null,
        lockedAt: null,
        etag
      }

      const response = await updatePage({
        data: unlockData,
        options: {}
      })

      setIsLocked(false)
      setLockedBy(null)
      setEtag(response.etag)
      toast.success("Page unlocked")
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Page was modified while trying to unlock")
        await loadPageData(pageData._id)
      } else {
        toast.error("Failed to unlock page")
      }
    }
  }

  // Version restore with full object
  const handleRestoreVersion = async (versionId: string) => {
    if (isLocked && lockedBy !== user?.id) {
      toast.error(`Page is locked by ${lockedBy}`)
      return
    }

    try {
      const restoredData = await restorePageVersion(versionId)

      // Validate restored data
      if (!restoredData._id || restoredData._id !== pageId) {
        throw new Error("Invalid restored page data")
      }

      // Update all state from restored data
      setPageData(restoredData)
      setSlugHistory(restoredData.slugHistory || [])
      originalSlugRef.current = restoredData.slug || ""
      setPageVersions(restoredData.versions || [])
      setIsLocked(!!restoredData.isLocked)
      setLockedBy(restoredData.lockedBy || null)
      setEtag(restoredData.etag || "")
      setIsDirty(true)

      toast.success("Version restored")
    } catch (error) {
      console.error("Failed to restore version:", error)
      toast.error("Failed to restore version")
    }
  }

  // Publish with validation
  const handlePublish = async (type: "now" | "schedule", date?: string, time?: string) => {
    if (isLocked && lockedBy !== user?.id) {
      toast.error(`Page is locked by ${lockedBy}`)
      return
    }

    // Validate before publishing
    const isValidSlug = await validateSlug(pageData.slug)
    if (!isValidSlug) {
      toast.error("Please fix slug validation errors before publishing")
      return
    }

    setIsSaving(true)
    try {
      const publishData = {
        ...pageData,
        status: type === "now" ? "published" : "scheduled",
        publishedAt: type === "now"
          ? new Date().toISOString()
          : new Date(`${date}T${time}:00`).toISOString(),
        settings: {
          ...pageData.settings,
          publishedVersionId: pageData._id
        },
        etag
      }

      const response = await updatePage({
        data: publishData,
        options: {}
      })

      // Create publish version
      await createPageVersion({
        pageId: pageData._id,
        data: publishData,
        createdBy: user?.id || "system",
        changes: [type === "now" ? "Published" : "Scheduled for publish"],
        autoSave: false
      })

      const newStatus: Page["status"] = "published"

      setPageData(prev => ({
        ...prev!,
        status: newStatus,
        etag: response.etag,
        publishedAt: new Date().toISOString()
      }))

      setLastSaved(new Date())
      setIsDirty(false)
      setEtag(response.etag)

      toast.success(type === "now" ? "Page published" : "Page scheduled")
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Conflict detected during publish")
        await loadPageData(pageData._id)
      } else {
        console.error("Publish failed:", error)
        toast.error("Failed to publish page")
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Structured data change handler with validation
  const handleStructuredDataChange = (value: string) => {
    try {
      const data = value.trim() ? JSON.parse(value) : {}
      setPageData(prev => ({
        ...prev,
        seo: { ...prev.seo, structuredData: data }
      }))
      setIsDirty(true)
      setStructuredDataError(null)
    } catch (error) {
      // Keep the text but show error
      setStructuredDataError("Invalid JSON format")
      setIsDirty(true)
    }
  }

  // Generate SEO preview
  const generateSEOPreview = () => {
    const title = pageData.seo?.metaTitle || pageData.title
    const description = pageData.seo?.metaDescription || pageData.content.substring(0, 160)
    const canonical = pageData.seo?.canonicalUrl || `/${pageData.slug}`

    const seo = {
      title,
      description,
      canonical,
      robots: `${pageData.seo?.robots?.index ? 'index' : 'noindex'},${pageData.seo?.robots?.follow ? 'follow' : 'nofollow'}`,
      openGraph: {
        title: pageData.seo?.openGraph?.title || title,
        description: pageData.seo?.openGraph?.description || description,
        image: pageData.seo?.openGraph?.image || '',
        type: pageData.seo?.openGraph?.type || 'website'
      },
      twitter: {
        card: pageData.seo?.twitter?.card || 'summary_large_image',
        title: pageData.seo?.twitter?.title || title,
        description: pageData.seo?.twitter?.description || description,
        image: pageData.seo?.twitter?.image || '',
        site: pageData.seo?.twitter?.site || ''
      },
      structuredData: pageData.seo?.structuredData || {}
    }

    return JSON.stringify(seo, null, 2)
  }


  // Check if page is locked by another user
  const isLockedByOtherUser = isLocked && lockedBy !== user?.id


  // Conditional rendering instead of early return
  if (!selectedTenantId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading tenant...</p>
        </div>
      </div>
    )
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
            <h1 className="text-balance text-2xl font-bold tracking-tight">
              {pageData.title || "Untitled Page"}
            </h1>
            <Badge variant={pageData.status === "published" ? "default" : "secondary"}>
              {pageData.status}
            </Badge>
            {isLocked && (
              <Badge variant={isLockedByOtherUser ? "destructive" : "default"}>
                <Lock className="h-3 w-3 mr-1" />
                {isLockedByOtherUser ? `Locked by ${lockedBy}` : "Locked by you"}
              </Badge>
            )}
            {pageData.settings.pageType !== "default" && (
              <Badge variant="outline">
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
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span>/{pageData.slug || "untitled"}</span>
            <span>•</span>
            <span>Last edited by {pageData.lastModifiedBy || pageData.author}</span>
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
          <Button
            variant="outline"
            onClick={() => setShowVersions(!showVersions)}
            disabled={isLockedByOtherUser}
          >
            <History className="h-4 w-4 mr-2" />
            History ({pageVersions.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={isLockedByOtherUser}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {isLocked ? (
            <Button
              onClick={handleUnlock}
              disabled={isLockedByOtherUser || !user}
            >
              <Unlock className="h-4 w-4 mr-2" />
              Unlock
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleLock}
              disabled={isLockedByOtherUser || !user}
            >
              <Lock className="h-4 w-4 mr-2" />
              Lock
            </Button>
          )}
          {pageData.status === "draft" ? (
            <Button
              onClick={() => setShowPublish(true)}
              disabled={isSaving || isLockedByOtherUser || !slugValidation.isValid}
            >
              <Globe className="h-4 w-4 mr-2" />
              Publish
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleManualSave}
              disabled={isSaving || isLockedByOtherUser || !slugValidation.isValid}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Validation alerts */}
      {!slugValidation.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Slug validation failed: {slugValidation.message}
          </AlertDescription>
        </Alert>
      )}

      {structuredDataError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Structured data error: {structuredDataError}
          </AlertDescription>
        </Alert>
      )}

      {isLockedByOtherUser && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            This page is locked by {lockedBy}. You cannot make changes until they unlock it.
          </AlertDescription>
        </Alert>
      )}

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
                  onChange={(e) => {
                    setPageData(prev => ({ ...prev, title: e.target.value }))
                    setIsDirty(true)
                  }}
                  className="text-lg font-medium"
                  disabled={isLockedByOtherUser}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">yoursite.com/</span>
                  <Input
                    id="slug"
                    value={pageData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    disabled={isLockedByOtherUser}
                  />
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/${pageData.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                {slugValidation.isChecking && (
                  <p className="text-xs text-muted-foreground">Checking slug availability...</p>
                )}
                {slugHistory.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Previous slugs: {slugHistory.map(s => s.slug).join(", ")}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={pageData.content}
                  onChange={(e) => {
                    setPageData(prev => ({ ...prev, content: e.target.value }))
                    setIsDirty(true)
                  }}
                  rows={12}
                  className="font-mono text-sm"
                  disabled={isLockedByOtherUser}
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
              <CardHeader className="cursor-pointer">
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
                  <Tabs defaultValue="basic">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="robots">Robots</TabsTrigger>
                      <TabsTrigger value="social">Social</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                          id="metaTitle"
                          value={pageData.seo?.metaTitle ?? ""}
                          onChange={(e) => {
                            setPageData(prev => ({
                              ...prev,
                              seo: { ...prev.seo, metaTitle: e.target.value }
                            }))
                            setIsDirty(true)
                          }}
                          placeholder="Enter meta title"
                          disabled={isLockedByOtherUser}
                        />
                        <p className="text-xs text-muted-foreground">
                          {pageData.seo?.metaTitle?.length ?? ""} /60 characters (optimal: 50-60)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                          id="metaDescription"
                          value={pageData.seo?.metaDescription ?? ""}
                          onChange={(e) => {
                            setPageData(prev => ({
                              ...prev,
                              seo: { ...prev.seo, metaDescription: e.target.value }
                            }))
                            setIsDirty(true)
                          }}
                          placeholder="Enter meta description"
                          rows={3}
                          disabled={isLockedByOtherUser}
                        />
                        <p className="text-xs text-muted-foreground">
                          {pageData.seo?.metaDescription?.length ?? ""}/160 characters (optimal: 150-160)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="focusKeyword">Focus Keyword</Label>
                        <Input
                          id="focusKeyword"
                          value={pageData.seo.focusKeyword}
                          onChange={(e) => {
                            setPageData(prev => ({
                              ...prev,
                              seo: { ...prev.seo, focusKeyword: e.target.value }
                            }))
                            setIsDirty(true)
                          }}
                          placeholder="e.g., content management system"
                          disabled={isLockedByOtherUser}
                        />
                      </div>

                      <Separator />

                      <div className="p-4 rounded-lg border bg-muted/30">
                        <p className="text-sm font-medium mb-2">Search Preview</p>
                        <div className="space-y-1">
                          <p className="text-sm text-primary font-medium">
                            {pageData.seo.metaTitle || pageData.title || "No title set"}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-400">
                            yoursite.com/{pageData.slug || "untitled"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pageData.seo.metaDescription || "No meta description set"}
                          </p>
                        </div>
                      </div>
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
                            onCheckedChange={(checked) => {
                              setPageData(prev => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  robots: { ...prev.seo.robots, index: checked }
                                }
                              }))
                              setIsDirty(true)
                            }}
                            disabled={isLockedByOtherUser}
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
                            onCheckedChange={(checked) => {
                              setPageData(prev => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  robots: { ...prev.seo.robots, follow: checked }
                                }
                              }))
                              setIsDirty(true)
                            }}
                            disabled={isLockedByOtherUser}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Include in Sitemap</Label>
                            <p className="text-sm text-muted-foreground">
                              Include this page in the sitemap
                            </p>
                          </div>
                          <Switch
                            checked={pageData.seo.sitemapInclusion}
                            onCheckedChange={(checked) => {
                              setPageData(prev => ({
                                ...prev,
                                seo: { ...prev.seo, sitemapInclusion: checked }
                              }))
                              setIsDirty(true)
                            }}
                            disabled={isLockedByOtherUser}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="font-medium">Open Graph</h4>
                        <div className="space-y-2">
                          <Label>OG Title</Label>
                          <Input
                            value={pageData.seo.openGraph?.title || ""}
                            onChange={(e) => {
                              setPageData(prev => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  openGraph: { ...prev.seo.openGraph, title: e.target.value }
                                }
                              }))
                              setIsDirty(true)
                            }}
                            placeholder="Open Graph title"
                            disabled={isLockedByOtherUser}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>OG Description</Label>
                          <Textarea
                            value={pageData.seo.openGraph?.description || ""}
                            onChange={(e) => {
                              setPageData(prev => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  openGraph: { ...prev.seo.openGraph, description: e.target.value }
                                }
                              }))
                              setIsDirty(true)
                            }}
                            placeholder="Open Graph description"
                            rows={2}
                            disabled={isLockedByOtherUser}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>OG Image URL</Label>
                          <Input
                            value={pageData.seo.openGraph?.image || ""}
                            onChange={(e) => {
                              setPageData(prev => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  openGraph: { ...prev.seo.openGraph, image: e.target.value }
                                }
                              }))
                              setIsDirty(true)
                            }}
                            placeholder="https://example.com/image.jpg"
                            disabled={isLockedByOtherUser}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="canonicalUrl">Canonical URL</Label>
                          <Input
                            id="canonicalUrl"
                            value={pageData.seo.canonicalUrl || ""}
                            onChange={(e) => {
                              setPageData(prev => ({
                                ...prev,
                                seo: { ...prev.seo, canonicalUrl: e.target.value }
                              }))
                              setIsDirty(true)
                            }}
                            placeholder="https://example.com/canonical-path"
                            disabled={isLockedByOtherUser}
                          />
                          <p className="text-xs text-muted-foreground">
                            Leave empty to use page URL
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Structured Data (JSON-LD)</Label>
                          <Textarea
                            value={JSON.stringify(pageData.seo.structuredData || {}, null, 2)}
                            onChange={(e) => handleStructuredDataChange(e.target.value)}
                            rows={6}
                            className="font-mono text-sm"
                            disabled={isLockedByOtherUser}
                          />
                          <p className="text-xs text-muted-foreground">
                            {structuredDataError
                              ? `Error: ${structuredDataError}`
                              : "Valid JSON-LD for structured data"}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
              <CardHeader className="cursor-pointer">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <CardTitle>Advanced Settings</CardTitle>
                  {settingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageType">Page Type</Label>
                      <Select
                        value={pageData.settings.pageType}
                        onValueChange={(value: PageType) => {
                          setPageData(prev => ({
                            ...prev,
                            settings: { ...prev.settings, pageType: value }
                          }))
                          setIsDirty(true)
                        }}
                        disabled={isLockedByOtherUser}
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
                        onValueChange={(value: Visibility) => {
                          setPageData(prev => ({
                            ...prev,
                            settings: { ...prev.settings, visibility: value }
                          }))
                          setIsDirty(true)
                        }}
                        disabled={isLockedByOtherUser}
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

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Featured Page</p>
                      <p className="text-xs text-muted-foreground">Show in featured sections</p>
                    </div>
                    <Switch
                      checked={pageData.settings.featured}
                      onCheckedChange={(checked) => {
                        setPageData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, featured: checked }
                        }))
                        setIsDirty(true)
                      }}
                      disabled={isLockedByOtherUser}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Allow Comments</p>
                      <p className="text-xs text-muted-foreground">Enable user comments</p>
                    </div>
                    <Switch
                      checked={pageData.settings.allowComments}
                      onCheckedChange={(checked) => {
                        setPageData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, allowComments: checked }
                        }))
                        setIsDirty(true)
                      }}
                      disabled={isLockedByOtherUser}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template">Page Template</Label>
                    <Select
                      value={pageData.settings.template}
                      onValueChange={(value: string) => {
                        setPageData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, template: value }
                        }))
                        setIsDirty(true)
                      }}
                      disabled={isLockedByOtherUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="full-width">Full Width</SelectItem>
                        <SelectItem value="sidebar">With Sidebar</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                      </SelectContent>
                    </Select>
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
                  {pageData.status === "scheduled" && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(pageData.publishedAt ?? "").toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="datetime-local"
                  value={pageData.publishedAt ? new Date(pageData.publishedAt).toISOString().slice(0, 16) : ""}
                  onChange={(e) => {
                    setPageData(prev => ({ ...prev, publishedAt: e.target.value }))
                    setIsDirty(true)
                  }}
                  disabled={isLockedByOtherUser}
                />
              </div>

              <div className="space-y-2">
                <Label>Author</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{pageData.author}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {showVersions && pageVersions.length > 0 && (
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
                          disabled={isLockedByOtherUser}
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

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/${pageData.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Page
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowPreview(true)}
                disabled={isLockedByOtherUser}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Changes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleManualSave}
                disabled={isSaving || isLockedByOtherUser || !slugValidation.isValid || !!structuredDataError}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Now
              </Button>
              <Separator />
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                disabled={isLockedByOtherUser}
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
        seoPreview={generateSEOPreview()}
        environment="draft"
      />

      <PublishModal
        isOpen={showPublish}
        onClose={() => setShowPublish(false)}
        onPublish={handlePublish}
        content={pageData}
        validation={[]}
      />
    </div>
  )
}