"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  X,
  File,
  Image,
  Video,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// API imports (as specified)
import { createMedia } from "@/Api/Media/Create";
import { loadMedia } from "@/Api/Media/Fetch";
import { getUserPages as loadPages } from "@/Api/Page/Fetch";
import UnderConstruction404 from "@/notNow/UnderConstruction404";

// Types
interface Page {
  _id: string;
  title: string;
}

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  size: number;
  mimeType: string;
  url?: string;
  status: "uploading" | "ready" | "failed";
  createdAt?: string;
}

export default function MediaLibraryPage() {

    const isUpdating = true;
    
    if(isUpdating){
      return <UnderConstruction404 />
    }
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // State slices as required
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Simulate tenant selection - in real app, this would come from parent/context
  useEffect(() => {
    // Mock: Simulate having a tenantId after component mounts
    const mockTenantId = "website-1";
    setTenantId(mockTenantId);
    toast({
      title: "Website selected",
      description: "Now select a page to manage media",
    });
  }, []);

  // Load pages when tenantId is available
  useEffect(() => {
    if (!tenantId) return;

    // In your fetchPages function
    const fetchPages = async () => {
      setIsLoadingPages(true);
      setError(null);
      try {
        const pagesData = await loadPages();
        console.log("Pages Data", pagesData);
        // Transform the data to match your interface
        const transformedPages = pagesData.map((page: Page) => ({
          _id: page._id,
          title: page.title,
        }));
        setPages(transformedPages || []);
        // ...
        if (!pagesData || pagesData.length === 0) {
          toast({
            title: "No pages found",
            description: "Create a page first to upload media",
            variant: "destructive",
          });
        }
      } catch (err) {
        setError(
          "Failed to load pages either page is not created or not exist ",
        );
        toast({
          title: "Error loading pages",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPages(false);
      }
    };

    fetchPages();
  }, [tenantId]);

  // Load media when page is selected
  useEffect(() => {
    if (!tenantId || !selectedPageId) return;

    const fetchMedia = async () => {
      setIsLoadingMedia(true);
      setError(null);
      try {
        const mediaData = await loadMedia();
        if (mediaData !== undefined) {
          setMediaList(mediaData.data || []);
        }
      } catch (err) {
        setError("Failed to load media");
        toast({
          title: "Error loading media",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMedia(false);
      }
    };

    fetchMedia();
  }, [tenantId, selectedPageId]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || !tenantId || !selectedPageId) {
      toast({
        title: "Cannot upload",
        description: "Please select a page first",
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach(async (file) => {
      // Create optimistic media item
      const optimisticItem: MediaItem = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique
        name: file.name,
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : "document",
        size: file.size,
        mimeType: file.type,
        status: "uploading",
        createdAt: new Date().toISOString(),
      };

      // Add to list immediately for optimistic UI
      setMediaList((prev) => [...prev, optimisticItem]);
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        const payload = {
          tenantId,
          pageId: selectedPageId,
          media: {
            name: file.name,
            type: optimisticItem.type,
            size: file.size,
            mimeType: file.type,
            status: "uploading" as const,
          },
        };

        const result = await createMedia(payload);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Update with server response
        setMediaList((prev) =>
          prev.map((media) =>
            media.id === optimisticItem.id
              ? ({ ...result, status: "ready" as const } as MediaItem)
              : media,
          ),
        );
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded`,
        });
      } catch (err) {
        clearInterval(progressInterval);

        // Update status to failed
        setMediaList((prev) =>
          prev.map((item) =>
            item.id === optimisticItem.id
              ? { ...item, status: "failed" as const }
              : item,
          ),
        );

        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  const handleRetryUpload = async (item: MediaItem) => {
    if (!tenantId || !selectedPageId) return;

    setMediaList((prev) =>
      prev.map((media) =>
        media.id === item.id
          ? { ...media, status: "uploading" as const }
          : item,
      ),
    );

    try {
      const payload = {
        tenantId,
        pageId: selectedPageId,
        media: {
          name: item.name,
          type: item.type,
          size: item.size,
          mimeType: item.mimeType,
          status: "uploading" as const,
        },
      };

      const result = await createMedia(payload);

      setMediaList((prev) =>
        prev.map((media) =>
          media.id === item.id
            ? ({ ...result, status: "ready" as const } as MediaItem)
            : media,
        ),
      );

      toast({
        title: "Upload retry successful",
        description: `${item.name} has been uploaded`,
      });
    } catch (err) {
      setMediaList((prev) =>
        prev.map((media) =>
          media.id === item.id
            ? { ...media, status: "failed" as const }
            : media,
        ),
      );

      toast({
        title: "Retry failed",
        description: `Failed to upload ${item.name}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;

    // Optimistic removal
    const itemToDelete = selectedMedia;
    setMediaList((prev) => prev.filter((item) => item.id !== selectedMedia.id));

    try {
      // In real implementation, call delete API here
      toast({
        title: "File deleted",
        description: `${itemToDelete.name} has been removed`,
      });
    } catch (err) {
      // Rollback on failure
      setMediaList((prev) => [...prev, itemToDelete]);
      toast({
        title: "Delete failed",
        description: "Failed to delete the file",
        variant: "destructive",
      });
    } finally {
      setIsDeleteOpen(false);
      setSelectedMedia(null);
    }
  };

  const handleDownload = (item: MediaItem) => {
    if (item.status !== "ready") {
      toast({
        title: "Cannot download",
        description: "File is not ready for download",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download started",
      description: `${item.name} download started.`,
    });
  };

  const getStatusBadge = (status: MediaItem["status"]) => {
    const content =
      status === "uploading"
        ? "Uploading"
        : status === "ready"
          ? "Ready"
          : "Failed";

    const Icon =
      status === "uploading"
        ? Clock
        : status === "ready"
          ? CheckCircle
          : AlertCircle;

    return (
      <Badge
        variant="outline"
        className={
          status === "uploading"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : status === "ready"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
        }
      >
        <span className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {content}
        </span>
      </Badge>
    );
  };

  const renderPreview = (item: MediaItem) => {
    if (item.status !== "ready") {
      return (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center">
            <File className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
        </div>
      );
    }

    switch (item.type) {
      case "image":
        return (
          <img
            src={item.url || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        );
      case "video":
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video src={item.url} className="max-w-full max-h-full" controls />
          </div>
        );
      case "document":
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs font-medium truncate px-2">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round(item.size / 1024)} KB
              </p>
            </div>
          </div>
        );
    }
  };

  const filteredItems = mediaList.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "images" && item.type === "image") ||
      (activeTab === "videos" && item.type === "video") ||
      (activeTab === "documents" && item.type === "document");
    return matchesSearch && matchesTab;
  });

  const selectedPage = pages.find((p) => p._id === selectedPageId);

  // If no tenant selected
  if (!tenantId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Website</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please select a website to manage media
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Media Library
          </h1>
          <p className="text-pretty text-muted-foreground mt-1">
            Manage media for{" "}
            {selectedPage ? `"${selectedPage.title}"` : "selected page"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Page Selector */}
          <div className="w-64">
            <Select
              value={selectedPageId || ""}
              onValueChange={(value) => {
                setSelectedPageId(value);
                setMediaList([]);
              }}
              disabled={isLoadingPages}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingPages ? "Loading pages..." : "Select a page"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {pages.length === 0 ? (
                  <SelectItem key="no-pages" value="no-pages" disabled>
                    No pages found
                  </SelectItem>
                ) : (
                  pages.map((page) => (
                    <SelectItem key={page._id} value={page._id}>
                      {page.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Button */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedPageId || isUploading}
          >
            {isUploading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFileUpload}
            disabled={!selectedPageId}
          />
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && uploadProgress > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading files...</span>
                <span className="text-sm text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              All Files
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {!selectedPageId ? (
            // No page selected state
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a page</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Choose a page from the dropdown above to manage its media
                  files
                </p>
              </CardContent>
            </Card>
          ) : isLoadingMedia ? (
            // Loading state
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-muted-foreground">
                  Loading media...
                </p>
              </CardContent>
            </Card>
          ) : filteredItems.length > 0 ? (
            // Media grid
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={`${item.id}-${item.name}`} // Add a more unique key
                  className={`group hover:shadow-md transition-shadow ${
                    item.status === "failed" ? "border-destructive/50" : ""
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square bg-muted rounded-lg mb-3 relative overflow-hidden">
                      {renderPreview(item)}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedMedia(item);
                            setIsPreviewOpen(true);
                          }}
                          disabled={item.status !== "ready"}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleDownload(item)}
                              disabled={item.status !== "ready"}
                            >
                              <Download className="h-3 w-3 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setSelectedMedia(item);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Status indicator */}
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(item.status)}
                      </div>

                      {/* Retry button for failed uploads */}
                      {item.status === "failed" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute bottom-2 right-2"
                          onClick={() => handleRetryUpload(item)}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p
                        className="text-xs font-medium truncate"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{Math.round(item.size / 1024)} KB</span>
                        {item.createdAt && (
                          <span>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Empty state
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No media files</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Upload media files to display them here
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedPageId}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.name}</DialogTitle>
            <DialogDescription>
              {selectedMedia && (
                <div className="flex items-center gap-4 mt-2">
                  <span>{Math.round(selectedMedia.size / 1024)} KB</span>
                  <span>•</span>
                  <span>{selectedMedia.mimeType}</span>
                  <span>•</span>
                  {getStatusBadge(selectedMedia.status)}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {selectedMedia ? (
              selectedMedia.status === "ready" ? (
                selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.url || "/placeholder.svg"}
                    alt={selectedMedia.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : selectedMedia.type === "video" ? (
                  <video
                    src={selectedMedia.url}
                    className="max-w-full max-h-full"
                    controls
                    autoPlay
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium">{selectedMedia.name}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedMedia.mimeType} •{" "}
                      {Math.round(selectedMedia.size / 1024)} KB
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center p-8">
                  <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium">File not available</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This file is {selectedMedia.status}
                  </p>
                  {selectedMedia.status === "failed" && (
                    <Button
                      className="mt-4"
                      onClick={() => handleRetryUpload(selectedMedia)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Upload
                    </Button>
                  )}
                </div>
              )
            ) : (
              <div className="text-center p-8">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No media selected</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedMedia?.status === "ready") {
                  handleDownload(selectedMedia);
                }
              }}
              disabled={!selectedMedia || selectedMedia.status !== "ready"}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedMedia?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
