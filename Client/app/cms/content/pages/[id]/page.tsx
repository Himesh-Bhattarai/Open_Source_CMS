"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Eye,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  History,
  Check,
  AlertCircle,
  Lock,
  Unlock,
  Shield,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PreviewModal } from "@/components/cms/preview-modal";
import { PublishModal } from "@/components/cms/publish-modal";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getPageById } from "@/Api/Page/Fetch";
import { restorePageVersion } from "@/Api/Page/Services";
import { updatePage } from "@/Api/Page/CreatePage";
import type { Page, PageVersion, Visibility, PageType } from "@/lib/types/page";

import { useAuth } from "@/hooks/useAuth";

// Immutable data captured in phase-1.
interface Phase1Data {
  title: string;
  slug: string;
  tenantId: string;
  pageTree: any;
  authorId: string;
  authorName?: string;
  content: string;
  blocks: any[];
}

// Editable data allowed in phase-2.
interface Phase2Payload {
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    canonicalUrl: string;
    robots: {
      index: boolean;
      follow: boolean;
      maxImagePreview: "none" | "standard" | "large";
      maxSnippet: number;
      maxVideoPreview: number;
    };
    openGraph: {
      title: string;
      description: string;
      image: string;
      type: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      image: string;
      site: string;
    };
    structuredData: any;
    sitemapInclusion: boolean;
  };
  settings: {
    pageType: PageType;
    visibility: Visibility;
    featured: boolean;
    allowComments: boolean;
    template: string;
    isHomepage: boolean;
  };
  status: Page["status"];
  publishedAt?: string;
}

export default function PageEditor() {
  const { user } = useAuth();

  const params = useParams();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [pageVersions, setPageVersions] = useState<PageVersion[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState<string | null>(null);
  const [lockedByName, setLockedByName] = useState<string | null>(null);
  const [etag, setEtag] = useState("");
  const [structuredDataError, setStructuredDataError] = useState<string | null>(null);
  const [autoSavePaused, setAutoSavePaused] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phase1Data, setPhase1Data] = useState<Phase1Data | null>(null);

  const [phase2Data, setPhase2Data] = useState<Phase2Payload>({
    seo: {
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      canonicalUrl: "",
      robots: {
        index: true,
        follow: true,
        maxImagePreview: "large",
        maxSnippet: -1,
        maxVideoPreview: -1,
      },
      openGraph: {
        title: "",
        description: "",
        image: "",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "",
        description: "",
        image: "",
        site: "",
      },
      structuredData: {},
      sitemapInclusion: true,
    },
    settings: {
      pageType: "default",
      visibility: "public",
      featured: false,
      allowComments: true,
      template: "default",
      isHomepage: false,
    },
    status: "draft",
    publishedAt: "",
  });

  // Accept malformed nested params and normalize to a single id.
  const getPageId = useCallback(() => {
    const id = params.id;
    if (!id) return "";
    if (Array.isArray(id)) {
      const candidate = id.find((part) => part && part !== "undefined" && part !== "null");
      return candidate || "";
    }
    if (typeof id === "string" && id.includes("/")) {
      const segments = id.split("/").filter(Boolean);
      const candidate = segments.find((part) => part !== "undefined" && part !== "null");
      return candidate || "";
    }
    return id === "undefined" || id === "null" ? "" : id;
  }, [params.id]);

  const pageId = getPageId();
  const currentUserId = user?.id !== undefined && user?.id !== null ? String(user.id) : null;
  const currentUserName = user?.name ? String(user.name) : null;
  const isLockedByOtherUser = isLocked && lockedBy !== currentUserId;

  const markDirty = () => {
    setAutoSavePaused(false);
    setIsDirty(true);
  };

  const toLocalDateTimeInput = (isoDate?: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  useEffect(() => {
    if (!pageId) return;

    loadPageData(pageId);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [pageId]);

  useEffect(() => {
    if (isDirty && !isSaving && !isLockedByOtherUser && !structuredDataError && !autoSavePaused) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        autoSave();
      }, 10000);
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [isDirty, isSaving, isLockedByOtherUser, structuredDataError, autoSavePaused]);

  const loadPageData = async (pageId: string) => {
    try {
      const data = await getPageById(pageId);

      if (!data) {
        toast.error("Page not found");
        router.push("/cms/content/pages");
        return;
      }

      if (!data._id || !data.tenantId) {
        throw new Error("Invalid page data from server");
      }

      setPhase1Data({
        title: data.title,
        slug: data.slug,
        tenantId: data.tenantId,
        pageTree: data.pageTree || {},
        authorId: data.settings?.authorId || data.authorId || "",
        authorName: data.author || data.settings?.authorName || "",
        content: data.content || "",
        blocks: data.blocks || [],
      });

      setPhase2Data({
        seo: {
          metaTitle: data.seo?.metaTitle || "",
          metaDescription: data.seo?.metaDescription || "",
          focusKeyword: data.seo?.focusKeyword || "",
          canonicalUrl: data.seo?.canonicalUrl || "",
          robots: {
            index: data.seo?.robots?.index ?? true,
            follow: data.seo?.robots?.follow ?? true,
            maxImagePreview: data.seo?.robots?.maxImagePreview || "large",
            maxSnippet: data.seo?.robots?.maxSnippet ?? -1,
            maxVideoPreview: data.seo?.robots?.maxVideoPreview ?? -1,
          },
          openGraph: {
            title: data.seo?.openGraph?.title || "",
            description: data.seo?.openGraph?.description || "",
            image: data.seo?.openGraph?.image || "",
            type: data.seo?.openGraph?.type || "website",
          },
          twitter: {
            card: data.seo?.twitter?.card || "summary_large_image",
            title: data.seo?.twitter?.title || "",
            description: data.seo?.twitter?.description || "",
            image: data.seo?.twitter?.image || "",
            site: data.seo?.twitter?.site || "",
          },
          structuredData: data.seo?.structuredData || {},
          sitemapInclusion: data.seo?.sitemapInclusion ?? true,
        },
        settings: {
          pageType: data.settings?.pageType || "default",
          visibility: data.settings?.visibility || "public",
          featured: data.settings?.featured || false,
          allowComments:
            data.settings?.allowComments !== undefined ? data.settings.allowComments : true,
          template: data.settings?.template || "default",
          isHomepage: data.settings?.isHomepage || false,
        },
        status: data.status || "draft",
        publishedAt: data.publishedAt || "",
      });

      setPageVersions(data.versions || []);
      const lock = data.settings?.locked;
      setIsLocked(Boolean(lock?.isLocked || data.isLocked));
      setLockedBy(
        lock?.byUserId ? String(lock.byUserId) : data.lockedBy ? String(data.lockedBy) : null,
      );
      setLockedByName(lock?.byUserName || data.lockedByName || null);
      setEtag(data.etag || "");
      setIsDirty(false);
      setAutoSavePaused(false);
    } catch (error) {
      console.error("Failed to load page:", error);
      toast.error("Failed to load page data");
    }
  };

  const validateStructuredData = (jsonString: string): boolean => {
    try {
      if (!jsonString.trim()) {
        setStructuredDataError(null);
        return true;
      }

      const parsed = JSON.parse(jsonString);

      if (typeof parsed !== "object" || parsed === null) {
        setStructuredDataError("Structured data must be a JSON object");
        return false;
      }

      if (
        ("@context" in parsed && !parsed["@context"]) ||
        ("@type" in parsed && !parsed["@type"])
      ) {
        setStructuredDataError("@context and @type cannot be empty if provided");
        return false;
      }

      setStructuredDataError(null);
      return true;
    } catch {
      setStructuredDataError("Invalid JSON format");
      return false;
    }
  };

  const buildPhase2Payload = useCallback((): Phase2Payload => {
    // Keep canonical URL absolute before sending to backend.
    let canonicalUrl = phase2Data.seo.canonicalUrl || "";
    if (canonicalUrl && !canonicalUrl.startsWith("http")) {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      canonicalUrl = canonicalUrl.startsWith("/")
        ? `${origin || ""}${canonicalUrl}`
        : `https://${canonicalUrl}`;
    }

    return {
      seo: {
        metaTitle: phase2Data.seo.metaTitle,
        metaDescription: phase2Data.seo.metaDescription,
        focusKeyword: phase2Data.seo.focusKeyword,
        canonicalUrl: canonicalUrl,
        robots: {
          index: phase2Data.seo.robots.index,
          follow: phase2Data.seo.robots.follow,
          maxImagePreview: phase2Data.seo.robots.maxImagePreview,
          maxSnippet: phase2Data.seo.robots.maxSnippet,
          maxVideoPreview: phase2Data.seo.robots.maxVideoPreview,
        },
        openGraph: {
          title: phase2Data.seo.openGraph.title,
          description: phase2Data.seo.openGraph.description,
          image: phase2Data.seo.openGraph.image,
          type: phase2Data.seo.openGraph.type,
        },
        twitter: {
          card: phase2Data.seo.twitter.card,
          title: phase2Data.seo.twitter.title,
          description: phase2Data.seo.twitter.description,
          image: phase2Data.seo.twitter.image,
          site: phase2Data.seo.twitter.site,
        },
        structuredData: phase2Data.seo.structuredData,
        sitemapInclusion: phase2Data.seo.sitemapInclusion,
      },
      settings: {
        pageType: phase2Data.settings.pageType,
        visibility: phase2Data.settings.visibility,
        featured: phase2Data.settings.featured,
        allowComments: phase2Data.settings.allowComments,
        template: phase2Data.settings.template,
        isHomepage: phase2Data.settings.isHomepage,
      },
      status: phase2Data.status,
      publishedAt: phase2Data.publishedAt,
    };
  }, [phase2Data]);

  const autoSave = async () => {
    if (
      !pageId ||
      !isDirty ||
      isSaving ||
      isLockedByOtherUser ||
      structuredDataError ||
      autoSavePaused
    ) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = buildPhase2Payload();

      const response = await updatePage(pageId, {
        data: payload,
        etag,
        options: { autoSave: true },
      });

      setLastSaved(new Date());
      setIsDirty(false);
      setEtag(response.etag || "");
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Conflict detected. Page was modified by someone else.");
        await loadPageData(pageId);
      } else if (error.status === 423) {
        toast.error("Page is locked by another user");
        await loadPageData(pageId);
      } else {
        console.error("Auto-save failed:", error);
        setAutoSavePaused(true);
        toast.error("Auto-save paused due to an error. Save manually after fixing fields.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!pageId) {
      toast.error("Invalid page id");
      return;
    }
    if (structuredDataError) {
      toast.error("Fix structured data errors before saving");
      return;
    }

    try {
      const payload = buildPhase2Payload();

      const response = await updatePage(pageId, {
        data: payload,
        etag,
        options: { autoSave: false },
      });

      setLastSaved(new Date());
      setIsDirty(false);
      setEtag(response.etag);
      setAutoSavePaused(false);

      toast.success("Saved");
      router.push("/cms/content/pages?message=Page%20saved%20successfully");
    } catch (err: any) {
      if (err?.status === 409) {
        toast.error("Conflict detected. Please reload and try again.");
        await loadPageData(pageId);
      } else if (err?.status === 423) {
        toast.error("Page is locked by another user");
        await loadPageData(pageId);
      } else {
        toast.error(err?.message || "Save failed");
      }
    }
  };

  const handleLock = async () => {
    if (!pageId) {
      toast.error("Invalid page id");
      return;
    }
    if (!user || !currentUserId) {
      toast.error("User session required");
      return;
    }

    try {
      const lockData = {
        isLocked: true,
        lockedBy: currentUserId,
        lockedByName: currentUserName,
        lockedAt: new Date(),
        etag,
      };

      const response = await updatePage(pageId, {
        data: lockData as any,
        etag,
        options: {},
      });

      setIsLocked(true);
      setLockedBy(currentUserId);
      setLockedByName(currentUserName);
      setEtag(response.etag);
      toast.success("Page locked");
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Page was modified while trying to lock");
        await loadPageData(pageId);
      } else {
        toast.error("Failed to lock page");
      }
    }
  };

  const handleUnlock = async () => {
    if (!pageId) {
      toast.error("Invalid page id");
      return;
    }
    if (!user || !currentUserId) {
      toast.error("User session required");
      return;
    }

    if (!currentUserId || lockedBy !== currentUserId) {
      toast.error(`Only ${lockedByName || lockedBy} can unlock this page`);
      return;
    }

    try {
      const unlockData = {
        isLocked: false,
        lockedBy: null,
        lockedAt: null,
        etag,
      };

      const response = await updatePage(pageId, {
        data: unlockData as any,
        etag,
        options: {},
      });

      setIsLocked(false);
      setLockedBy(null);
      setLockedByName(null);
      setEtag(response.etag);
      toast.success("Page unlocked");
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Page was modified while trying to unlock");
        await loadPageData(pageId);
      } else {
        toast.error("Failed to unlock page");
      }
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!pageId) {
      toast.error("Invalid page id");
      return;
    }
    if (isLocked && lockedBy !== currentUserId) {
      toast.error(`Page is locked by ${lockedByName || lockedBy}`);
      return;
    }

    try {
      const restoredData = await restorePageVersion(versionId);

      if (!restoredData._id || restoredData._id !== pageId) {
        throw new Error("Invalid restored page data");
      }

      setPhase1Data({
        title: restoredData.title,
        slug: restoredData.slug,
        tenantId: restoredData.tenantId,
        pageTree: restoredData.pageTree || {},
        authorId: restoredData.settings?.authorId || restoredData.authorId || "",
        authorName: restoredData.author || restoredData.settings?.authorName || "",
        content: restoredData.content || "",
        blocks: restoredData.blocks || [],
      });

      setPhase2Data({
        seo: {
          metaTitle: restoredData.seo?.metaTitle || "",
          metaDescription: restoredData.seo?.metaDescription || "",
          focusKeyword: restoredData.seo?.focusKeyword || "",
          canonicalUrl: restoredData.seo?.canonicalUrl || "",
          robots: {
            index: restoredData.seo?.robots?.index ?? true,
            follow: restoredData.seo?.robots?.follow ?? true,
            maxImagePreview: restoredData.seo?.robots?.maxImagePreview || "large",
            maxSnippet: restoredData.seo?.robots?.maxSnippet ?? -1,
            maxVideoPreview: restoredData.seo?.robots?.maxVideoPreview ?? -1,
          },
          openGraph: restoredData.seo?.openGraph || {
            title: "",
            description: "",
            image: "",
            type: "website",
          },
          twitter: restoredData.seo?.twitter || {
            card: "summary_large_image",
            title: "",
            description: "",
            image: "",
            site: "",
          },
          structuredData: restoredData.seo?.structuredData || {},
          sitemapInclusion: restoredData.seo?.sitemapInclusion ?? true,
        },
        settings: {
          pageType: restoredData.settings?.pageType || "default",
          visibility: restoredData.settings?.visibility || "public",
          featured: restoredData.settings?.featured || false,
          allowComments:
            restoredData.settings?.allowComments !== undefined
              ? restoredData.settings.allowComments
              : true,
          template: restoredData.settings?.template || "default",
          isHomepage: restoredData.settings?.isHomepage || false,
        },
        status: restoredData.status || "draft",
        publishedAt: restoredData.publishedAt || "",
      });

      setPageVersions(restoredData.versions || []);
      setIsLocked(Boolean(restoredData.settings?.locked?.isLocked || restoredData.isLocked));
      setLockedBy(
        restoredData.settings?.locked?.byUserId
          ? String(restoredData.settings.locked.byUserId)
          : restoredData.lockedBy
            ? String(restoredData.lockedBy)
            : null,
      );
      setLockedByName(
        restoredData.settings?.locked?.byUserName || restoredData.lockedByName || null,
      );
      setEtag(restoredData.etag || "");
      markDirty();

      toast.success("Version restored");
    } catch (error) {
      console.error("Failed to restore version:", error);
      toast.error("Failed to restore version");
    }
  };

  const handlePublish = async (type: "now" | "schedule", date?: string, time?: string) => {
    if (!pageId) {
      toast.error("Invalid page id");
      return;
    }
    if (isLocked && lockedBy !== currentUserId) {
      toast.error(`Page is locked by ${lockedByName || lockedBy}`);
      return;
    }
    if (structuredDataError) {
      toast.error("Fix structured data errors before publishing");
      return;
    }

    setIsSaving(true);
    try {
      const payload = buildPhase2Payload();

      const publishPayload = {
        ...payload,
        status: type === "now" ? ("published" as const) : ("scheduled" as const),
        publishedAt:
          type === "now"
            ? new Date().toISOString()
            : date && time
              ? new Date(`${date}T${time}:00`).toISOString()
              : "",
      };
      if (
        type === "schedule" &&
        (!publishPayload.publishedAt ||
          Number.isNaN(new Date(publishPayload.publishedAt).getTime()))
      ) {
        throw new Error("Schedule date and time are required");
      }

      const response = await updatePage(pageId, {
        data: publishPayload as any,
        etag,
        options: {},
      });

      setPhase2Data((prev) => ({
        ...prev,
        status: publishPayload.status,
        publishedAt: publishPayload.publishedAt,
      }));

      setLastSaved(new Date());
      setIsDirty(false);
      setEtag(response.etag);
      setAutoSavePaused(false);

      toast.success(type === "now" ? "Page published" : "Page scheduled");
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("Conflict detected during publish");
        await loadPageData(pageId);
      } else {
        console.error("Publish failed:", error);
        toast.error("Failed to publish page");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleStructuredDataChange = (value: string) => {
    if (!validateStructuredData(value)) {
      markDirty();
      return;
    }

    const data = value.trim() ? JSON.parse(value) : {};
    setPhase2Data((prev) => ({
      ...prev,
      seo: { ...prev.seo, structuredData: data },
    }));
    markDirty();
    setStructuredDataError(null);
  };

  const generateSEOPreview = () => {
    if (!phase1Data) return "{}";

    const title = phase2Data.seo.metaTitle || phase1Data.title;
    const description = phase2Data.seo.metaDescription || phase1Data.content.substring(0, 160);
    const canonical = phase2Data.seo.canonicalUrl || `/${phase1Data.slug}`;

    const seo = {
      title,
      description,
      canonical,
      robots: phase2Data.seo.robots,
      openGraph: phase2Data.seo.openGraph,
      twitter: phase2Data.seo.twitter,
      structuredData: phase2Data.seo.structuredData,
      sitemapInclusion: phase2Data.seo.sitemapInclusion,
    };

    return JSON.stringify(seo, null, 2);
  };

  if (!phase1Data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cms/content/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-balance text-2xl font-bold tracking-tight">
              {phase1Data.title || "Untitled Page"}
            </h1>
            <Badge variant={phase2Data.status === "published" ? "default" : "secondary"}>
              {phase2Data.status}
            </Badge>
            {isLocked && (
              <Badge variant={isLockedByOtherUser ? "destructive" : "default"}>
                <Lock className="h-3 w-3 mr-1" />
                {isLockedByOtherUser
                  ? `Locked by ${lockedByName || lockedBy}`
                  : `Locked by ${currentUserName || "you"}`}
              </Badge>
            )}
            {phase2Data.settings.pageType !== "default" && (
              <Badge variant="outline">{phase2Data.settings.pageType}</Badge>
            )}
            {phase2Data.settings.visibility !== "public" && (
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                {phase2Data.settings.visibility}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Phase-1 content is locked</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span>/{phase1Data.slug || "untitled"}</span>
            <span>|</span>
            <span>Tenant: {phase1Data.tenantId}</span>
            {lastSaved && (
              <>
                <span>|</span>
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
            <Button onClick={handleUnlock} disabled={isLockedByOtherUser || !user}>
              <Unlock className="h-4 w-4 mr-2" />
              Unlock
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLock} disabled={isLockedByOtherUser || !user}>
              <Lock className="h-4 w-4 mr-2" />
              Lock
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleManualSave}
            disabled={isSaving || isLockedByOtherUser || !!structuredDataError}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          {phase2Data.status === "draft" && (
            <Button onClick={() => setShowPublish(true)} disabled={isSaving || isLockedByOtherUser}>
              <Globe className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Phase-1 fields are locked:</strong> Title, Slug, Content, Tenant ID, and Page Tree
          cannot be edited in Phase-2. Only SEO and publishing settings are editable.
        </AlertDescription>
      </Alert>

      {structuredDataError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Structured data error: {structuredDataError}</AlertDescription>
        </Alert>
      )}

      {isLockedByOtherUser && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            This page is locked by {lockedByName || lockedBy}. You cannot make changes until they
            unlock it.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-muted bg-background shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Phase-1 Content
                </CardTitle>
                <CardDescription>
                  This content was created in Phase-1 and cannot be edited
                </CardDescription>
              </div>

              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                Locked
              </span>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Title</p>
                <p className="text-lg font-semibold">{phase1Data.title}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">URL Slug</p>
                <code className="text-sm bg-muted px-2 py-1 rounded">/{phase1Data.slug}</code>
              </div>

              {phase1Data.content && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Text Content</p>
                  <div className="border rounded-md p-4 bg-muted/40 text-sm leading-relaxed">
                    {phase1Data.content}
                  </div>
                </div>
              )}

              {phase1Data.pageTree && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Page Structure</p>
                  <div className="border rounded-md bg-muted/30 p-3 text-xs font-mono max-h-48 overflow-auto">
                    {JSON.stringify(phase1Data.pageTree, null, 2)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
              <CardHeader className="cursor-pointer">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <CardTitle>SEO Settings (Phase-2 Editable)</CardTitle>
                    {phase2Data.seo.metaTitle && phase2Data.seo.metaDescription ? (
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
                  {seoOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
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
                          value={phase2Data.seo.metaTitle}
                          onChange={(e) => {
                            setPhase2Data((prev) => ({
                              ...prev,
                              seo: { ...prev.seo, metaTitle: e.target.value },
                            }));
                            markDirty();
                          }}
                          placeholder="Enter meta title"
                          disabled={isLockedByOtherUser}
                        />
                        <p className="text-xs text-muted-foreground">
                          {phase2Data.seo.metaTitle.length}/60 characters (optimal: 50-60)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                          id="metaDescription"
                          value={phase2Data.seo.metaDescription}
                          onChange={(e) => {
                            setPhase2Data((prev) => ({
                              ...prev,
                              seo: { ...prev.seo, metaDescription: e.target.value },
                            }));
                            markDirty();
                          }}
                          placeholder="Enter meta description"
                          rows={3}
                          disabled={isLockedByOtherUser}
                        />
                        <p className="text-xs text-muted-foreground">
                          {phase2Data.seo.metaDescription.length}/160 characters (optimal: 150-160)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="focusKeyword">Focus Keyword</Label>
                        <Input
                          id="focusKeyword"
                          value={phase2Data.seo.focusKeyword}
                          onChange={(e) => {
                            setPhase2Data((prev) => ({
                              ...prev,
                              seo: { ...prev.seo, focusKeyword: e.target.value },
                            }));
                            markDirty();
                          }}
                          placeholder="Primary keyword for this page"
                          disabled={isLockedByOtherUser}
                        />
                      </div>

                      <Separator />

                      <div className="p-4 rounded-lg border bg-muted/30">
                        <p className="text-sm font-medium mb-2">Search Preview</p>
                        <div className="space-y-1">
                          <p className="text-sm text-primary font-medium">
                            {phase2Data.seo.metaTitle || phase1Data.title || "No title set"}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-400">
                            yoursite.com/{phase1Data.slug || "untitled"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {phase2Data.seo.metaDescription || "No meta description set"}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="robots" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Allow Search Indexing</p>
                            <p className="text-xs text-muted-foreground">
                              When off, page is marked noindex
                            </p>
                          </div>
                          <Switch
                            checked={phase2Data.seo.robots.index}
                            onCheckedChange={(checked) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  robots: { ...prev.seo.robots, index: checked },
                                },
                              }));
                              markDirty();
                            }}
                            disabled={isLockedByOtherUser}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Allow Link Following</p>
                            <p className="text-xs text-muted-foreground">
                              When off, links are marked nofollow
                            </p>
                          </div>
                          <Switch
                            checked={phase2Data.seo.robots.follow}
                            onCheckedChange={(checked) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  robots: { ...prev.seo.robots, follow: checked },
                                },
                              }));
                              markDirty();
                            }}
                            disabled={isLockedByOtherUser}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Include in Sitemap</p>
                            <p className="text-xs text-muted-foreground">
                              Controls sitemap generation visibility
                            </p>
                          </div>
                          <Switch
                            checked={phase2Data.seo.sitemapInclusion}
                            onCheckedChange={(checked) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: { ...prev.seo, sitemapInclusion: checked },
                              }));
                              markDirty();
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
                            value={phase2Data.seo.openGraph.title}
                            onChange={(e) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  openGraph: { ...prev.seo.openGraph, title: e.target.value },
                                },
                              }));
                              markDirty();
                            }}
                            placeholder="Open Graph title"
                            disabled={isLockedByOtherUser}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>OG Description</Label>
                          <Textarea
                            value={phase2Data.seo.openGraph.description}
                            onChange={(e) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  openGraph: { ...prev.seo.openGraph, description: e.target.value },
                                },
                              }));
                              markDirty();
                            }}
                            placeholder="Open Graph description"
                            rows={2}
                            disabled={isLockedByOtherUser}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>OG Image URL</Label>
                          <Input
                            value={phase2Data.seo.openGraph.image}
                            onChange={(e) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  openGraph: { ...prev.seo.openGraph, image: e.target.value },
                                },
                              }));
                              markDirty();
                            }}
                            placeholder="https://example.com/image.jpg"
                            disabled={isLockedByOtherUser}
                          />
                        </div>

                        <Separator />

                        <h4 className="font-medium">Twitter Card</h4>
                        <div className="space-y-2">
                          <Label>Twitter Title</Label>
                          <Input
                            value={phase2Data.seo.twitter.title}
                            onChange={(e) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  twitter: { ...prev.seo.twitter, title: e.target.value },
                                },
                              }));
                              markDirty();
                            }}
                            placeholder="Twitter title"
                            disabled={isLockedByOtherUser}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Twitter Description</Label>
                          <Textarea
                            value={phase2Data.seo.twitter.description}
                            onChange={(e) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  twitter: { ...prev.seo.twitter, description: e.target.value },
                                },
                              }));
                              markDirty();
                            }}
                            placeholder="Twitter description"
                            rows={2}
                            disabled={isLockedByOtherUser}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Twitter Image URL</Label>
                          <Input
                            value={phase2Data.seo.twitter.image}
                            onChange={(e) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  twitter: { ...prev.seo.twitter, image: e.target.value },
                                },
                              }));
                              markDirty();
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
                            value={phase2Data.seo.canonicalUrl}
                            onChange={(e) => {
                              setPhase2Data((prev) => ({
                                ...prev,
                                seo: { ...prev.seo, canonicalUrl: e.target.value },
                              }));
                              markDirty();
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
                            value={JSON.stringify(phase2Data.seo.structuredData, null, 2)}
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

          <Card>
            <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
              <CardHeader className="cursor-pointer">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <CardTitle>Advanced Settings (Phase-2 Editable)</CardTitle>
                  {settingsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageType">Page Type</Label>
                      <Select
                        value={phase2Data.settings.pageType}
                        onValueChange={(value: PageType) => {
                          setPhase2Data((prev) => ({
                            ...prev,
                            settings: { ...prev.settings, pageType: value },
                          }));
                          markDirty();
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
                        value={phase2Data.settings.visibility}
                        onValueChange={(value: Visibility) => {
                          setPhase2Data((prev) => ({
                            ...prev,
                            settings: { ...prev.settings, visibility: value },
                          }));
                          markDirty();
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
                      checked={phase2Data.settings.featured}
                      onCheckedChange={(checked) => {
                        setPhase2Data((prev) => ({
                          ...prev,
                          settings: { ...prev.settings, featured: checked },
                        }));
                        markDirty();
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
                      checked={phase2Data.settings.allowComments}
                      onCheckedChange={(checked) => {
                        setPhase2Data((prev) => ({
                          ...prev,
                          settings: { ...prev.settings, allowComments: checked },
                        }));
                        markDirty();
                      }}
                      disabled={isLockedByOtherUser}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template">Page Template</Label>
                    <Select
                      value={phase2Data.settings.template}
                      onValueChange={(value: string) => {
                        setPhase2Data((prev) => ({
                          ...prev,
                          settings: { ...prev.settings, template: value },
                        }));
                        markDirty();
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

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Set as Homepage</p>
                      <p className="text-xs text-muted-foreground">Make this the site homepage</p>
                    </div>
                    <Switch
                      checked={phase2Data.settings.isHomepage}
                      onCheckedChange={(checked) => {
                        setPhase2Data((prev) => ({
                          ...prev,
                          settings: { ...prev.settings, isHomepage: checked },
                        }));
                        markDirty();
                      }}
                      disabled={isLockedByOtherUser}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={phase2Data.status === "published" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {phase2Data.status}
                  </Badge>
                  {phase2Data.status === "scheduled" && phase2Data.publishedAt && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(phase2Data.publishedAt).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                <Select
                  value={phase2Data.status}
                  onValueChange={(value: Page["status"]) => {
                    setPhase2Data((prev) => ({
                      ...prev,
                      status: value,
                    }));
                    markDirty();
                  }}
                  disabled={isLockedByOtherUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Set status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="datetime-local"
                  value={toLocalDateTimeInput(phase2Data.publishedAt)}
                  onChange={(e) => {
                    const nextPublishedAt = e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "";
                    setPhase2Data((prev) => ({ ...prev, publishedAt: nextPublishedAt }));
                    markDirty();
                  }}
                  disabled={isLockedByOtherUser}
                />
              </div>

              <div className="rounded-lg border bg-muted/30 px-3 py-2">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
                  <span>Author</span>
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Phase-1
                  </span>
                </div>

                <div className="mt-1 text-sm font-medium truncate">
                  {phase1Data.authorName || phase1Data.authorId}
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
                    <div
                      key={version.id}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              v{version.versionNumber} |{" "}
                              {new Date(version.createdAt).toLocaleDateString()}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {version.autoSave ? "Auto-save" : "Manual"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{version.createdBy}</p>
                          <div className="mt-1">
                            {(Array.isArray(version.changes) ? version.changes : []).map(
                              (change, idx) => (
                                <span key={idx} className="text-xs text-muted-foreground mr-2">
                                  | {change}
                                </span>
                              ),
                            )}
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
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={{ ...phase1Data, ...phase2Data } as any}
        previewUrl={`/${phase1Data.slug}`}
        seoPreview={generateSEOPreview()}
        environment="draft"
      />

      <PublishModal
        isOpen={showPublish}
        onClose={() => setShowPublish(false)}
        onPublish={handlePublish}
        content={{ ...phase1Data, ...phase2Data } as any}
        validation={[]}
      />
    </div>
  );
}
