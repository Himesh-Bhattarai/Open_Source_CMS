"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Upload,
  Search,
  Video,
  FileText,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  Loader2,
  Globe,
  File,
} from "lucide-react"
import { toast } from "sonner"
import { useTenant } from "@/context/TenantContext"
import { createMedia } from "@/Api/Media/Create"
import { loadMedia } from "@/Api/Media/Fetch"
import { deleteMediaById } from "@/Api/Media/Delete"
import { getUserPages } from "@/Api/Page/Fetch"
import { loadAllBlogs } from "@/Api/Blog/Load"

type Scope = "global" | "page" | "blog"
type MediaType = "image" | "video" | "document"

type PageItem = { _id: string; title: string; tenantId?: string }
type BlogItem = { _id: string; title: string; tenantId?: string }

type MediaItem = {
  id: string
  name: string
  type: MediaType
  size: number
  mimeType: string
  url?: string
  status: "ready" | "uploading" | "failed"
  createdAt?: string
  scope: Scope
  entityType: "page" | "blog" | null
  entityId: string | null
}

const getTypeFromMime = (mimeType = ""): MediaType => {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  return "document"
}

const normalizeMedia = (raw: any): MediaItem => ({
  id: String(raw?._id || raw?.id || ""),
  name: raw?.filename || raw?.originalName || raw?.name || "Untitled",
  type: getTypeFromMime(raw?.mimeType || ""),
  size: Number(raw?.size || 0),
  mimeType: raw?.mimeType || "application/octet-stream",
  url: raw?.url || "",
  status: raw?.status || "ready",
  createdAt: raw?.createdAt,
  scope: (raw?.scope || "global") as Scope,
  entityType: raw?.entityType || null,
  entityId: raw?.entityId || null,
})

const toDataUrlIfPreviewable = (file: File): Promise<string> =>
  new Promise((resolve) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      resolve("")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      resolve("")
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "")
    reader.onerror = () => resolve("")
    reader.readAsDataURL(file)
  })

export default function MediaLibraryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { tenants, activeTenant, selectedTenantId, setActiveTenant } = useTenant()

  const [scope, setScope] = useState<Scope>("global")
  const [pages, setPages] = useState<PageItem[]>([])
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [selectedPageId, setSelectedPageId] = useState("")
  const [selectedBlogId, setSelectedBlogId] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)

  const entityType = scope === "page" ? "page" : scope === "blog" ? "blog" : null
  const entityId = scope === "page" ? selectedPageId : scope === "blog" ? selectedBlogId : ""

  const canLoadScopedMedia =
    !!selectedTenantId && (scope === "global" || (scope === "page" && !!selectedPageId) || (scope === "blog" && !!selectedBlogId))

  useEffect(() => {
    if (!selectedTenantId) return

    const loadContent = async () => {
      setIsLoadingContent(true)
      try {
        const [pagesResponse, blogsResponse] = await Promise.allSettled([
          getUserPages(),
          loadAllBlogs(),
        ])

        const allPages =
          pagesResponse.status === "fulfilled"
            ? Array.isArray(pagesResponse.value)
              ? pagesResponse.value
              : Array.isArray(pagesResponse.value?.pages)
                ? pagesResponse.value.pages
                : Array.isArray(pagesResponse.value?.data)
                  ? pagesResponse.value.data
                  : []
            : []

        const allBlogs =
          blogsResponse.status === "fulfilled"
            ? Array.isArray(blogsResponse.value)
              ? blogsResponse.value
              : Array.isArray(blogsResponse.value?.blogs)
                ? blogsResponse.value.blogs
                : Array.isArray(blogsResponse.value?.data)
                  ? blogsResponse.value.data
                  : []
            : []

        setPages(allPages.filter((p: any) => !p?.tenantId || p.tenantId === selectedTenantId))
        setBlogs(allBlogs.filter((b: any) => !b?.tenantId || b.tenantId === selectedTenantId))
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoadingContent(false)
      }
    }

    loadContent()
  }, [selectedTenantId])

  useEffect(() => {
    if (!selectedTenantId || !canLoadScopedMedia) {
      setMediaList([])
      return
    }

    const fetchMedia = async () => {
      setIsLoadingMedia(true)
      const response = await loadMedia({
        tenantId: selectedTenantId,
        scope,
        entityType,
        entityId,
      })

      if (!response?.ok) {
        toast.error(response?.message || "Failed to load media")
        setMediaList([])
        setIsLoadingMedia(false)
        return
      }

      const normalized = Array.isArray(response.data)
        ? response.data.map(normalizeMedia)
        : []
      setMediaList(normalized)
      setIsLoadingMedia(false)
    }

    fetchMedia()
  }, [selectedTenantId, scope, entityType, entityId, canLoadScopedMedia])

  const filteredItems = useMemo(() => {
    return mediaList.filter((item) => {
      const bySearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const byType =
        activeTab === "all" ||
        (activeTab === "images" && item.type === "image") ||
        (activeTab === "videos" && item.type === "video") ||
        (activeTab === "documents" && item.type === "document")
      return bySearch && byType
    })
  }, [mediaList, searchQuery, activeTab])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedTenantId) return

    if (scope !== "global" && !entityId) {
      toast.error(scope === "page" ? "Choose a page first" : "Choose a blog first")
      return
    }

    setIsUploading(true)

    for (const file of Array.from(files)) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const optimistic: MediaItem = {
        id: tempId,
        name: file.name,
        type: getTypeFromMime(file.type),
        size: file.size,
        mimeType: file.type,
        url: "",
        status: "uploading",
        createdAt: new Date().toISOString(),
        scope,
        entityType,
        entityId: entityId || null,
      }

      setMediaList((prev) => [optimistic, ...prev])

      const previewUrl = await toDataUrlIfPreviewable(file)
      const payload = {
        tenantId: selectedTenantId,
        scope,
        entityType,
        entityId: entityId || null,
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: previewUrl,
        folder: scope === "global" ? "global" : `${scope}/${entityId}`,
        status: "ready",
      }

      const response = await createMedia(payload)
      if (!response?.ok || !response.data) {
        setMediaList((prev) =>
          prev.map((item) =>
            item.id === tempId ? { ...item, status: "failed" } : item,
          ),
        )
        continue
      }

      const normalized = normalizeMedia(response.data)
      setMediaList((prev) =>
        prev.map((item) => (item.id === tempId ? normalized : item)),
      )
    }

    toast.success("Upload complete")
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    const previous = mediaList
    setMediaList((prev) => prev.filter((item) => item.id !== deleteTarget.id))

    const response = await deleteMediaById(deleteTarget.id)
    if (!response?.ok) {
      setMediaList(previous)
      toast.error(response?.message || "Delete failed")
    }

    setDeleteTarget(null)
  }

  const handleDownload = (item: MediaItem) => {
    if (!item.url) {
      toast.error("This media has no file URL")
      return
    }

    const anchor = document.createElement("a")
    anchor.href = item.url
    anchor.download = item.name
    anchor.target = "_blank"
    anchor.rel = "noreferrer"
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground mt-1">Global and content-scoped media assets</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedTenantId || ""}
            onValueChange={(tenantId) => {
              const tenant = tenants.find((t) => t._id === tenantId)
              if (tenant) setActiveTenant(tenant)
            }}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant._id} value={tenant._id}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={scope}
            onValueChange={(value: Scope) => {
              setScope(value)
              setSelectedPageId("")
              setSelectedBlogId("")
              setMediaList([])
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
            </SelectContent>
          </Select>

          {scope === "page" && (
            <Select value={selectedPageId} onValueChange={setSelectedPageId}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder={isLoadingContent ? "Loading pages..." : "Select page"} />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page._id} value={page._id}>
                    {page.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {scope === "blog" && (
            <Select value={selectedBlogId} onValueChange={setSelectedBlogId}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder={isLoadingContent ? "Loading blogs..." : "Select blog"} />
              </SelectTrigger>
              <SelectContent>
                {blogs.map((blog) => (
                  <SelectItem key={blog._id} value={blog._id}>
                    {blog.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button onClick={() => fileInputRef.current?.click()} disabled={!selectedTenantId || isUploading}>
            {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={handleUpload}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Context</CardTitle>
          <CardDescription>
            Website: {activeTenant?.name || "Not selected"} | Scope: {scope}
            {scope === "page" && selectedPageId ? ` | Page: ${selectedPageId}` : ""}
            {scope === "blog" && selectedBlogId ? ` | Blog: ${selectedBlogId}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>
            Global media is shared. Page/blog media is tied to its content ID and filtered by system scope.
          </span>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search media"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {scope !== "global" && !entityId && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="pt-4 text-amber-800 text-sm">
            Select a {scope} to load scoped media.
          </CardContent>
        </Card>
      )}

      {isLoadingMedia ? (
        <Card>
          <CardContent className="pt-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading media...
          </CardContent>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
            <File className="h-10 w-10 mx-auto mb-3" />
            No media found in this context.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className={item.status === "failed" ? "border-red-300" : ""}>
              <CardContent className="p-3 space-y-2">
                <div className="aspect-square rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                  {item.type === "image" && item.url ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  ) : item.type === "video" ? (
                    <Video className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                <p className="text-xs font-medium truncate" title={item.name}>{item.name}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{Math.max(1, Math.round(item.size / 1024))} KB</span>
                  <Badge variant={item.status === "failed" ? "destructive" : "outline"}>{item.status}</Badge>
                </div>

                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => setPreviewMedia(item)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleDownload(item)}>
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-2 text-red-600" onClick={() => setDeleteTarget(item)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!previewMedia} onOpenChange={(open) => !open && setPreviewMedia(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewMedia?.name}</DialogTitle>
            <DialogDescription>
              {previewMedia?.mimeType} | {previewMedia ? Math.max(1, Math.round(previewMedia.size / 1024)) : 0} KB
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-muted min-h-64 flex items-center justify-center overflow-hidden">
            {previewMedia?.type === "image" && previewMedia?.url ? (
              <img src={previewMedia.url} alt={previewMedia.name} className="max-w-full max-h-[60vh] object-contain" />
            ) : previewMedia?.type === "video" && previewMedia?.url ? (
              <video src={previewMedia.url} controls className="max-w-full max-h-[60vh]" />
            ) : (
              <div className="text-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                No inline preview available
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => previewMedia && handleDownload(previewMedia)}>
              Download
            </Button>
            <Button onClick={() => setPreviewMedia(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete media</DialogTitle>
            <DialogDescription>
              Delete "{deleteTarget?.name}" from this library?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
