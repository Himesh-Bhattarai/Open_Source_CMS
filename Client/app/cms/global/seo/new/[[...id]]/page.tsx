"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Globe,
  ImageIcon,
  LinkIcon,
  Eye,
  AlertTriangle,
  Check,
  X,
  FileText,
  Settings,
  Code,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createSeo } from "@/Api/Seo/Create";
import { useTenant } from "@/context/TenantContext";
import { fetchPagesByTenant } from "@/Api/Page/Fetch";
import { useParams, useRouter } from "next/navigation";
import { fetchSeoById } from "@/Api/Seo/Fetch";
import { updateSeo } from "@/Api/Seo/Create";

// Types - Simplified Page interface
interface Page {
  _id: string;
  id: string;
  title: string;
  slug: string;
  content?: any;
  status?: "draft" | "published" | "archived";
  contentType?: "article" | "page" | "product" | "event";
  featuredImage?: string;
  excerpt?: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PageSEO {
  title?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  robots: {
    index: boolean;
    follow: boolean;
    maxImagePreview?: "none" | "standard" | "large";
    maxSnippet?: number;
    maxVideoPreview?: number;
  };
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaType?:
    | "Article"
    | "BlogPosting"
    | "Product"
    | "WebPage"
    | "Event"
    | "Person"
    | "None";
  schemaData?: Record<string, any>;
  breadcrumbs?: Array<{
    name: string;
    url: string;
    position: number;
  }>;
}

interface SEOData {
  general: {
    siteTitle: string;
    siteTitleSeparator: string;
    metaDescription: string;
    defaultOgImage: string;
    favicon: string;
    siteUrl: string;
  };
  robots: {
    indexPages: boolean;
    followLinks: boolean;
    sitemapEnabled: boolean;
    sitemapUrl: string;
    robotsTxtEnabled: boolean;
    stagingNoIndex: boolean;
  };
  social: {
    ogSiteName: string;
    twitterCard: string;
    twitterSite: string;
    facebookAppId: string;
  };
  schemaData: {
    organizationName: string;
    organizationType: string;
    logo: string;
    socialProfiles: string[];
  };
  analytics: {
    googleAnalyticsId: string;
    googleTagManagerId: string;
    facebookPixelId: string;
  };
}

interface SEOValidation {
  errors: string[];
  warnings: string[];
  isValid: boolean;
}

// Helper functions (keep as is)
const normalizeSlug = (slug: string): string => {
  return slug.replace(/^\/+|\/+$/g, "");
};

const generateCanonical = (siteUrl: string, slug: string): string => {
  const cleanSlug = normalizeSlug(slug);
  return `${siteUrl.replace(/\/+$/, "")}/${cleanSlug}`;
};

const generateRobotsMeta = (
  pageSEO: PageSEO,
  globalRobots: any,
  pageData: Page,
  environment: string
): string => {
  let index = pageSEO.robots.index;
  let follow = pageSEO.robots.follow;

  // Advanced robots logic
  if (pageData.status === "draft") index = false;
  if (environment === "staging" && globalRobots.stagingNoIndex) index = false;

  const directives = [];
  if (!index) directives.push("noindex");
  else directives.push("index");

  if (!follow) directives.push("nofollow");
  else directives.push("follow");

  // Additional directives
  if (pageSEO.robots.maxImagePreview) {
    directives.push(`max-image-preview:${pageSEO.robots.maxImagePreview}`);
  }
  if (pageSEO.robots.maxSnippet) {
    directives.push(`max-snippet:${pageSEO.robots.maxSnippet}`);
  }
  if (pageSEO.robots.maxVideoPreview) {
    directives.push(`max-video-preview:${pageSEO.robots.maxVideoPreview}`);
  }

  return directives.join(", ");
};

const validateSEO = (
  pageSEO: PageSEO,
  globalSEO: SEOData,
  pageData: Page
): SEOValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  const title = pageSEO.title || pageData.title;
  if (title.length > 60) {
    warnings.push(
      `Title (${title.length} chars) exceeds recommended 60 characters`
    );
  }
  if (title.length < 15) {
    warnings.push(
      `Title (${title.length} chars) is shorter than recommended 15 characters`
    );
  }

  // Description validation
  const description =
    pageSEO.metaDescription || globalSEO.general.metaDescription || "";
  if (!description.trim()) {
    warnings.push("Missing meta description");
  } else if (description.length > 160) {
    warnings.push(
      `Description (${description.length} chars) exceeds 160 characters`
    );
  }

  // Canonical validation
  const canonical =
    pageSEO.canonicalUrl ||
    generateCanonical(globalSEO.general.siteUrl, pageData.slug);
  if (!canonical.startsWith("http")) {
    errors.push("Canonical URL must be an absolute URL");
  }

  // Sitemap conflict
  if (!pageSEO.robots.index && globalSEO.robots.sitemapEnabled) {
    warnings.push("Page is set to noindex but will still appear in sitemap");
  }

  // Image validation
  const ogImage = pageSEO.ogImage || globalSEO.general.defaultOgImage;
  if (ogImage && !ogImage.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    warnings.push("OG image should be a valid image file");
  }

  return {
    errors,
    warnings,
    isValid: errors.length === 0,
  };
};

const generateSchemaMarkup = (
  pageSEO: PageSEO,
  globalSEO: SEOData,
  pageData: Page
) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": pageSEO.schemaType || "WebPage",
    name: pageSEO.title || pageData.title,
    description: pageSEO.metaDescription || globalSEO.general.metaDescription,
    url:
      pageSEO.canonicalUrl ||
      generateCanonical(globalSEO.general.siteUrl, pageData.slug),
    publisher: {
      "@type": globalSEO.schemaData.organizationType,
      name: globalSEO.schemaData.organizationName,
      logo: {
        "@type": "ImageObject",
        url: globalSEO.schemaData.logo,
      },
    },
  };

  // Add schema type specific properties
  switch (pageSEO.schemaType) {
    case "Article":
    case "BlogPosting":
      Object.assign(baseSchema, {
        datePublished: pageData.createdAt || new Date().toISOString(),
        dateModified: pageData.updatedAt || new Date().toISOString(),
        author: {
          "@type": "Person",
          name: "Author Name",
        },
        headline: pageData.title,
        image: pageSEO.ogImage || globalSEO.general.defaultOgImage,
      });
      break;

    case "Product":
      Object.assign(baseSchema, {
        "@type": "Product",
        image: pageSEO.ogImage || globalSEO.general.defaultOgImage,
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0.00",
        },
      });
      break;
  }

  // Add breadcrumbs if available
  if (pageSEO.breadcrumbs && pageSEO.breadcrumbs.length > 0) {
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: pageSEO.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
    return [baseSchema, breadcrumbList];
  }

  return baseSchema;
};

const getImageFallback = (
  pageImage?: string,
  pageOgImage?: string,
  globalOgImage?: string
): string => {
  return pageImage || pageOgImage || globalOgImage || "";
};

export default function SEOSettingsPage() {
  const { tenants, activeTenant, setActiveTenant } = useTenant();
  const router = useRouter();
  const { id: idParam } = useParams();

  const seoId =
    Array.isArray(idParam) && idParam.length > 0 ? idParam[0] : undefined;
  const isEditMode = !!seoId;

  // Default active page
  const defaultPage: Page = {
    _id: "default-page",
    id: "default-page",
    title: "Example Page",
    slug: "example-page",
    content: {},
    status: "published",
    contentType: "page",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // State declarations
  const [activePage, setActivePage] = useState<Page>(defaultPage);
  const [globalSEO, setGlobalSEO] = useState<SEOData>({
    general: {
      siteTitle: "ContentFlow",
      siteTitleSeparator: "|",
      metaDescription: "Build and manage your websites with ContentFlow CMS",
      defaultOgImage: "/og-image.jpg",
      favicon: "/favicon.ico",
      siteUrl: "https://example.com",
    },
    robots: {
      indexPages: true,
      followLinks: true,
      sitemapEnabled: true,
      sitemapUrl: "/sitemap.xml",
      robotsTxtEnabled: true,
      stagingNoIndex: true,
    },
    social: {
      ogSiteName: "ContentFlow",
      twitterCard: "summary_large_image",
      twitterSite: "@contentflow",
      facebookAppId: "",
    },
    schemaData: {
      organizationName: "ContentFlow Inc.",
      organizationType: "Organization",
      logo: "/logo.svg",
      socialProfiles: [
        "https://twitter.com/contentflow",
        "https://facebook.com/contentflow",
      ],
    },
    analytics: {
      googleAnalyticsId: "G-XXXXXXXXXX",
      googleTagManagerId: "",
      facebookPixelId: "",
    },
  });

  const [pageSEO, setPageSEO] = useState<PageSEO>({
    title: "",
    metaDescription: "",
    canonicalUrl: "",
    robots: {
      index: true,
      follow: true,
      maxImagePreview: "standard",
      maxSnippet: -1,
      maxVideoPreview: -1,
    },
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    schemaType: "WebPage",
    breadcrumbs: [],
  });

  const [validation, setValidation] = useState<SEOValidation>({
    errors: [],
    warnings: [],
    isValid: true,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [environment, setEnvironment] = useState<"production" | "staging">(
    "production"
  );
  const [seoScope, setSeoScope] = useState<"global" | "page">("global");
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [seoData, setSeoData] = useState<any>(null);

  // Add a ref to track initial hydration
  const hasHydrated = useRef(false);

  // Consolidated loading state
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    loadingPages: false,
    loadingSeo: false,
    hasError: false,
  });

  // Generate auto canonical
  const autoCanonical = useMemo(() => {
    return generateCanonical(globalSEO.general.siteUrl, activePage.slug);
  }, [globalSEO.general.siteUrl, activePage.slug]);

  // Final canonical URL
  const finalCanonical = pageSEO.canonicalUrl || autoCanonical;

  // Final robots meta
  const finalRobotsMeta = useMemo(() => {
    return generateRobotsMeta(
      pageSEO,
      globalSEO.robots,
      activePage,
      environment
    );
  }, [pageSEO, globalSEO.robots, activePage, environment]);

  // Image fallback chain
  const finalOgImage = getImageFallback(
    activePage.featuredImage,
    pageSEO.ogImage,
    globalSEO.general.defaultOgImage
  );

  // Load pages for the tenant
  useEffect(() => {
    if (!activeTenant?._id) return;

    const loadPages = async () => {
      try {
        setLoadingState((prev) => ({ ...prev, loadingPages: true }));
        const fetchedPages = await fetchPagesByTenant(activeTenant._id);
        const pagesArray = Array.isArray(fetchedPages)
          ? fetchedPages
          : fetchedPages.pages || fetchedPages.data || [];

        setPages(pagesArray);

        // In create mode, set default page
        if (!isEditMode && pagesArray.length > 0) {
          setSelectedPageId(pagesArray[0]._id);
          setActivePage(pagesArray[0]);
          setSeoScope("page");
        }
      } catch (error) {
        console.error("Failed to load pages:", error);
      } finally {
        setLoadingState((prev) => ({ ...prev, loadingPages: false }));
      }
    };

    loadPages();
  }, [activeTenant?._id, isEditMode]);
  // Load SEO data in edit mode
  // Load SEO data in edit mode - FIXED for API response structure
  useEffect(() => {
    if (!isEditMode || !seoId || hasHydrated.current) return;

    const loadSeoData = async () => {
      try {
        setLoadingState((prev) => ({
          ...prev,
          loadingSeo: true,
          isLoading: true,
        }));
        const response = await fetchSeoById(seoId);

        if (!response) {
          throw new Error("SEO data not found");
        }

        // FIX: The API returns { data: { ... } } structure
        const fetchedSeo = response.data || response;
        console.log("✅ SEO Data fetched:", fetchedSeo);
        console.log("📊 Raw response:", response);
        console.log("📊 Scope from API:", fetchedSeo.scope);

        setSeoData(fetchedSeo);

        // Set scope from fetched data
        const scope = fetchedSeo.scope || "global";
        console.log("🔧 Setting seoScope to:", scope);
        setSeoScope(scope);

        if (scope === "global") {
          console.log("🌍 Processing GLOBAL SEO data");
          if (fetchedSeo.globalSEO) {
            console.log("Setting globalSEO:", fetchedSeo.globalSEO);
            setGlobalSEO(fetchedSeo.globalSEO);
          }
        } else {
          console.log("📄 Processing PAGE SEO data");
          if (fetchedSeo.pageSEO) {
            console.log("Setting pageSEO:", fetchedSeo.pageSEO);
            setPageSEO(fetchedSeo.pageSEO);
          }

          // Set page if available
          if (fetchedSeo.pageId) {
            console.log("🔍 Setting pageId:", fetchedSeo.pageId);
            setSelectedPageId(fetchedSeo.pageId);

            // Find and set the active page if pages are loaded
            if (pages.length > 0) {
              const page = pages.find((p) => p._id === fetchedSeo.pageId);
              if (page) {
                console.log("✅ Found associated page:", page.title);
                setActivePage(page);
              } else {
                console.warn(
                  "❌ Page not found in pages list:",
                  fetchedSeo.pageId
                );
              }
            }
          }
        }

        hasHydrated.current = true;
      } catch (error) {
        console.error("❌ Failed to load SEO data:", error);
        setLoadingState((prev) => ({ ...prev, hasError: true }));
      } finally {
        setLoadingState((prev) => ({
          ...prev,
          loadingSeo: false,
          isLoading: false,
        }));
      }
    };

    loadSeoData();
  }, [isEditMode, seoId, pages]);

  // Also add this debug effect to verify the actual response structure:
  useEffect(() => {
    if (seoData) {
      console.log("🔍 Current seoData structure:", seoData);
      console.log("🔍 Does it have data property?", "data" in seoData);
      console.log("🔍 Direct scope access:", seoData.scope);
      console.log("🔍 Data.scope access:", seoData.data?.scope);
    }
  }, [seoData]);

  //debug
  // Add this debug effect to track scope changes
  useEffect(() => {
    console.log("🔄 seoScope state changed to:", seoScope);
    console.log("isEditMode:", isEditMode);
    console.log("hasHydrated:", hasHydrated.current);
  }, [seoScope]);

  // Update activePage when pages are loaded in edit mode
  useEffect(() => {
    if (!isEditMode || !seoData || !seoData.pageId || pages.length === 0)
      return;

    // Only update if we have a page scope and the page hasn't been set yet
    if (
      seoData.scope === "page" &&
      seoData.pageId &&
      activePage._id === defaultPage._id
    ) {
      const page = pages.find((p) => p._id === seoData.pageId);
      if (page) {
        console.log("🔄 Updating active page after pages load:", page.title);
        setActivePage(page);
        setSelectedPageId(seoData.pageId);
      }
    }
  }, [pages, seoData, isEditMode, activePage._id, defaultPage._id]);

  // Run validation when SEO data changes
  useEffect(() => {
    const result = validateSEO(pageSEO, globalSEO, activePage);
    setValidation(result);
  }, [pageSEO, globalSEO, activePage]);

  // Update activePage when selectedPageId changes (for create mode or manual selection)
  useEffect(() => {
    if (
      seoScope === "page" &&
      selectedPageId &&
      pages.length > 0 &&
      !isEditMode
    ) {
      const page = pages.find((p) => p._id === selectedPageId);
      if (page && page._id !== activePage._id) {
        setActivePage(page);
      }
    } else if (seoScope === "global" && activePage._id !== defaultPage._id) {
      setActivePage(defaultPage);
    }
  }, [
    selectedPageId,
    pages,
    seoScope,
    activePage._id,
    defaultPage._id,
    isEditMode,
  ]);

  // Normalize and prepare data for saving
  const prepareSeoData = useCallback(() => {
    const normalizedPageSEO: PageSEO = {
      ...pageSEO,
      canonicalUrl: finalCanonical,
      ogImage: finalOgImage || undefined,
      robots: {
        ...pageSEO.robots,
        index: !finalRobotsMeta.includes("noindex"),
        follow: !finalRobotsMeta.includes("nofollow"),
      },
    };

    // Build payload for backend
    const payload: any = {
      tenantId: activeTenant?._id,
      scope: seoScope,
      meta: {},
    };

    if (seoScope === "global") {
      payload.globalSEO = globalSEO;
    } else {
      payload.pageId = selectedPageId;
      payload.pageSEO = normalizedPageSEO;
    }

    // In edit mode, preserve the _id
    if (isEditMode && seoId) {
      payload._id = seoId;
    }

    return payload;
  }, [
    pageSEO,
    globalSEO,
    seoScope,
    selectedPageId,
    activeTenant?._id,
    finalCanonical,
    finalOgImage,
    finalRobotsMeta,
    isEditMode,
    seoId,
  ]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!activeTenant?._id) {
      alert("Please select a tenant first");
      return;
    }

    if (seoScope === "page" && !selectedPageId) {
      alert("Please select a page first");
      return;
    }

    const seoDataToSave = prepareSeoData();

    // Validation
    if (validation.warnings.length > 0) {
      console.warn("SEO warnings:", validation.warnings);
    }

    if (!validation.isValid) {
      alert("Cannot save: Please fix validation errors");
      return;
    }

    try {
      setLoadingState((prev) => ({ ...prev, loadingSeo: true }));
      let response;

      if (isEditMode && seoId) {
        // EDIT MODE - Update existing
        console.log("Updating SEO with ID:", seoId);
        response = await updateSeo(seoId, seoDataToSave);
      } else {
        // CREATE MODE - Make new
        console.log("Creating new SEO");
        response = await createSeo(seoDataToSave);
      }

      if (response?.ok) {
        const message = isEditMode ? "SEO updated!" : "SEO created!";
        alert(message);
        router.push("/cms/global/seo");
      } else {
        throw new Error(response?.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(isEditMode ? "Failed to update SEO" : "Failed to create SEO");
    } finally {
      setLoadingState((prev) => ({ ...prev, loadingSeo: false }));
    }
  };

  // Handle scope change - disabled in edit mode
  const handleScopeChange = (value: "global" | "page") => {
    if (isEditMode) {
      // In edit mode, scope should be immutable from fetched data
      console.log(
        "⚠️ Scope change blocked in edit mode. Current scope:",
        seoScope
      );
      return;
    }

    const previousScope = seoScope;
    console.log("🔄 Changing scope from", previousScope, "to", value);
    setSeoScope(value);

    // Reset active page if switching scopes
    if (previousScope !== value) {
      if (value === "global") {
        setActivePage(defaultPage);
      } else if (value === "page" && pages.length > 0) {
        const pageToSet =
          pages.find((p) => p._id === selectedPageId) || pages[0];
        if (pageToSet) {
          setActivePage(pageToSet);
          setSelectedPageId(pageToSet._id);
        }
      }
    }
  };

  const handlePageSEOChange = (updates: Partial<PageSEO>) => {
    setPageSEO((prev) => ({ ...prev, ...updates }));
  };

  // Show loading state
  if (isEditMode && (loadingState.isLoading || !hasHydrated.current)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading SEO settings...</p>
          <div className="mt-2 text-sm text-muted-foreground">
            {loadingState.loadingPages && <p>Loading pages...</p>}
            {loadingState.loadingSeo && <p>Loading SEO data...</p>}
          </div>
        </div>
      </div>
    );
  }

  // Show error state if needed
  if (loadingState.hasError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to load data</h2>
          <p className="text-muted-foreground mb-4">
            Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {seoId ? "Edit SEO" : "Create SEO"}
          </h1>
          <p className="text-muted-foreground">
            {seoId ? "Update existing SEO settings" : "Create new SEO settings"}
          </p>

          {seoId && (
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                ID: {seoId.substring(0, 8)}...
              </Badge>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!activeTenant?._id || loadingState.loadingSeo}
          >
            <Save className="h-4 w-4 mr-2" />
            {loadingState.loadingSeo
              ? "Saving..."
              : seoId
              ? "Update SEO"
              : "Save SEO"}
          </Button>
          {seoId && (
            <Button variant="outline" onClick={() => router.push("/cms/seo")}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Website Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Website Selection</CardTitle>
          <CardDescription>
            Select the website to configure SEO for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website-select">Website</Label>
              <Select
                value={activeTenant?._id || ""}
                onValueChange={(tenantId) => {
                  const tenant = tenants.find((t) => t._id === tenantId);
                  if (tenant) {
                    setActiveTenant(tenant);
                    setPages([]);
                    setSelectedPageId("");
                  }
                }}
                disabled={isEditMode}
              >
                <SelectTrigger id="website-select">
                  <SelectValue placeholder="Select a website" />
                </SelectTrigger>
                <SelectContent>
                  {tenants?.map((tenant) => (
                    <SelectItem key={tenant._id} value={tenant._id}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>{tenant.name}</span>
                        {tenant.domain && (
                          <span className="text-muted-foreground text-sm">
                            ({tenant.domain})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeTenant && (
                <p className="text-sm text-muted-foreground">
                  Selected: {activeTenant?.domain}
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Apply SEO to:</Label>
              <RadioGroup
                value={seoScope} // This should now be "page" from the API
                onValueChange={(value: "global" | "page") =>
                  handleScopeChange(value)
                }
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="global" id="global-scope" />
                  <Label htmlFor="global-scope" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Global (entire website)</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      Apply SEO settings to all pages on the website
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="page" id="page-scope" />
                  <Label htmlFor="page-scope" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Individual page</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      Apply SEO settings to a specific page only
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {seoScope === "page" && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="page-select">Select Page</Label>
                <Select
                  value={selectedPageId}
                  onValueChange={setSelectedPageId}
                  disabled={loadingState.loadingPages || pages.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingState.loadingPages
                          ? "Loading pages..."
                          : pages.length === 0
                          ? "No pages available"
                          : "Select a page"
                      }
                    />
                  </SelectTrigger>

                  {pages.length > 0 && (
                    <SelectContent>
                      {pages.map((page) => (
                        <SelectItem key={page._id} value={page._id}>
                          <div className="flex flex-col">
                            <span>{page.title || "Untitled"}</span>
                            <span className="text-xs text-muted-foreground">
                              {page.slug || "no-slug"}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
                {activePage && activePage._id !== defaultPage._id && (
                  <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                    <p className="font-medium">Selected Page:</p>
                    <p>
                      {activePage.title} ({activePage.status})
                    </p>
                    <p className="text-muted-foreground">/{activePage.slug}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Warning Banner */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Global SEO Settings</p>
              <p className="text-sm text-muted-foreground">
                These settings apply to all pages unless overridden at the page
                level
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Settings - Only show when scope is page */}
      {seoScope === "page" &&
        activePage &&
        activePage._id !== defaultPage._id && (
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{activePage.title}</p>
                  <p className="text-sm text-muted-foreground">
                    /{activePage.slug}
                  </p>
                </div>
                <Badge
                  variant={
                    activePage.status === "published" ? "default" : "secondary"
                  }
                >
                  {activePage.status || "published"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Global Settings - Only show when scope is global */}
      {seoScope === "global" && (
        <Card>
          <CardHeader>
            <CardTitle>Global Settings</CardTitle>
            <CardDescription>
              These settings will apply to the entire website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Applying to entire website</p>
                <p className="text-sm text-muted-foreground">
                  SEO settings will affect all pages on {activeTenant?.domain}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <Alert variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">SEO Warnings</p>
              <ul className="list-disc list-inside text-sm">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Errors */}
      {validation.errors.length > 0 && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">SEO Errors</p>
              <ul className="list-disc list-inside text-sm">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="page" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="page">Page SEO</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="robots">Robots</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Page SEO Overrides - Only show when scope is page */}
        {seoScope === "page" && (
          <TabsContent value="page" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page-Level SEO Overrides</CardTitle>
                <CardDescription>
                  These settings override global SEO for this specific page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pageTitle">Page Title Override</Label>
                  <Input
                    id="pageTitle"
                    value={pageSEO.title}
                    onChange={(e) =>
                      handlePageSEOChange({ title: e.target.value })
                    }
                    placeholder={activePage.title}
                  />
                  <p className="text-xs text-muted-foreground">
                    If empty, uses page title: "{activePage.title}"
                  </p>
                  <div className="text-sm">
                    Preview:{" "}
                    <span className="font-medium">
                      {pageSEO.title || activePage.title}{" "}
                      {globalSEO.general.siteTitleSeparator}{" "}
                      {globalSEO.general.siteTitle}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageDescription">
                    Meta Description Override
                  </Label>
                  <Textarea
                    id="pageDescription"
                    value={pageSEO.metaDescription}
                    onChange={(e) =>
                      handlePageSEOChange({ metaDescription: e.target.value })
                    }
                    placeholder={globalSEO.general.metaDescription}
                    rows={3}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>If empty, uses global description</span>
                    <span>
                      {pageSEO.metaDescription?.length || 0} / 160 characters
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="canonicalUrl"
                        value={pageSEO.canonicalUrl || ""}
                        onChange={(e) =>
                          handlePageSEOChange({ canonicalUrl: e.target.value })
                        }
                        placeholder={autoCanonical}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handlePageSEOChange({ canonicalUrl: "" })
                        }
                      >
                        Auto
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Auto-generated: {autoCanonical}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Final canonical: {finalCanonical}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Robots Directives</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pageIndex">Index</Label>
                        <p className="text-sm text-muted-foreground">
                          {activePage.status === "draft" ||
                          (environment === "staging" &&
                            globalSEO.robots.stagingNoIndex)
                            ? "Forced noindex due to status/environment"
                            : "Allow search engines to index this page"}
                        </p>
                      </div>
                      <Switch
                        id="pageIndex"
                        checked={pageSEO.robots.index}
                        onCheckedChange={(checked) =>
                          handlePageSEOChange({
                            robots: { ...pageSEO.robots, index: checked },
                          })
                        }
                        disabled={
                          activePage.status === "draft" ||
                          (environment === "staging" &&
                            globalSEO.robots.stagingNoIndex)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pageFollow">Follow</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow search engines to follow links on this page
                        </p>
                      </div>
                      <Switch
                        id="pageFollow"
                        checked={pageSEO.robots.follow}
                        onCheckedChange={(checked) =>
                          handlePageSEOChange({
                            robots: { ...pageSEO.robots, follow: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="text-sm">
                    Final robots meta:{" "}
                    <code className="bg-muted px-2 py-1 rounded">
                      {finalRobotsMeta}
                    </code>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="ogImage">Open Graph Image Override</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ogImage"
                      value={pageSEO.ogImage || ""}
                      onChange={(e) =>
                        handlePageSEOChange({ ogImage: e.target.value })
                      }
                      placeholder="Leave empty for global/default"
                    />
                    <Button variant="outline">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Image fallback chain: Page featured image → Page OG image →
                    Global OG image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Final image: {finalOgImage || "No image set"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schemaType">Schema Type</Label>
                  <Select
                    value={pageSEO.schemaType}
                    onValueChange={(value: any) =>
                      handlePageSEOChange({ schemaType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select schema type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WebPage">WebPage</SelectItem>
                      <SelectItem value="Article">Article</SelectItem>
                      <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Person">Person</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Schema type helps search engines understand your content
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General SEO Settings</CardTitle>
              <CardDescription>
                Default meta information for your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={globalSEO.general.siteUrl}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      general: {
                        ...globalSEO.general,
                        siteUrl: e.target.value,
                      },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Base URL for canonical generation and absolute URLs
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={globalSEO.general.siteTitle}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      general: {
                        ...globalSEO.general,
                        siteTitle: e.target.value,
                      },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Your main site title (brand name)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="separator">Title Separator</Label>
                <Input
                  id="separator"
                  value={globalSEO.general.siteTitleSeparator}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      general: {
                        ...globalSEO.general,
                        siteTitleSeparator: e.target.value,
                      },
                    })
                  }
                  className="max-w-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Character between page title and site name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">
                  Default Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  value={globalSEO.general.metaDescription}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      general: {
                        ...globalSEO.general,
                        metaDescription: e.target.value,
                      },
                    })
                  }
                  rows={3}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Used when pages don't have their own description</span>
                  <span>
                    {globalSEO.general.metaDescription.length} / 160 characters
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Default Open Graph Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="ogImage"
                    value={globalSEO.general.defaultOgImage}
                    onChange={(e) =>
                      setGlobalSEO({
                        ...globalSEO,
                        general: {
                          ...globalSEO.general,
                          defaultOgImage: e.target.value,
                        },
                      })
                    }
                  />
                  <Button variant="outline">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200 x 630 pixels
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex gap-2">
                  <Input
                    id="favicon"
                    value={globalSEO.general.favicon}
                    onChange={(e) =>
                      setGlobalSEO({
                        ...globalSEO,
                        general: {
                          ...globalSEO.general,
                          favicon: e.target.value,
                        },
                      })
                    }
                  />
                  <Button variant="outline">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Browser tab icon (32x32 .ico or .png)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Robots & Sitemap (Enhanced) */}
        <TabsContent value="robots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Visibility</CardTitle>
              <CardDescription>
                Control how search engines crawl and index your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Global Settings</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="indexPages">Index Pages</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow search engines to index your pages by default
                    </p>
                  </div>
                  <Switch
                    id="indexPages"
                    checked={globalSEO.robots.indexPages}
                    onCheckedChange={(checked) =>
                      setGlobalSEO({
                        ...globalSEO,
                        robots: { ...globalSEO.robots, indexPages: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="followLinks">Follow Links</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow search engines to follow links on your site by
                      default
                    </p>
                  </div>
                  <Switch
                    id="followLinks"
                    checked={globalSEO.robots.followLinks}
                    onCheckedChange={(checked) =>
                      setGlobalSEO({
                        ...globalSEO,
                        robots: { ...globalSEO.robots, followLinks: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="stagingNoIndex">Noindex on Staging</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically set pages to noindex in staging environment
                    </p>
                  </div>
                  <Switch
                    id="stagingNoIndex"
                    checked={globalSEO.robots.stagingNoIndex}
                    onCheckedChange={(checked) =>
                      setGlobalSEO({
                        ...globalSEO,
                        robots: {
                          ...globalSEO.robots,
                          stagingNoIndex: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sitemap">XML Sitemap</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate sitemap.xml (excludes noindex
                      pages)
                    </p>
                  </div>
                  <Switch
                    id="sitemap"
                    checked={globalSEO.robots.sitemapEnabled}
                    onCheckedChange={(checked) =>
                      setGlobalSEO({
                        ...globalSEO,
                        robots: {
                          ...globalSEO.robots,
                          sitemapEnabled: checked,
                        },
                      })
                    }
                  />
                </div>

                {globalSEO.robots.sitemapEnabled && (
                  <div className="space-y-2 pl-4 border-l-2">
                    <Label htmlFor="sitemapUrl">Sitemap URL</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="sitemapUrl"
                        value={globalSEO.robots.sitemapUrl}
                        onChange={(e) =>
                          setGlobalSEO({
                            ...globalSEO,
                            robots: {
                              ...globalSEO.robots,
                              sitemapUrl: e.target.value,
                            },
                          })
                        }
                        readOnly
                      />
                      <Button variant="outline" size="sm">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="robotsTxt">Robots.txt</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate robots.txt file
                    </p>
                  </div>
                  <Switch
                    id="robotsTxt"
                    checked={globalSEO.robots.robotsTxtEnabled}
                    onCheckedChange={(checked) =>
                      setGlobalSEO({
                        ...globalSEO,
                        robots: {
                          ...globalSEO.robots,
                          robotsTxtEnabled: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Current Page Analysis</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Page Status:</span>
                    <Badge
                      variant={
                        activePage.status === "published"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {activePage.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Environment:</span>
                    <Badge
                      variant={
                        environment === "production" ? "default" : "secondary"
                      }
                    >
                      {environment}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Final Indexing:</span>
                    <Badge
                      variant={
                        finalRobotsMeta.includes("noindex")
                          ? "secondary"
                          : "default"
                      }
                    >
                      {finalRobotsMeta.includes("noindex")
                        ? "Noindex"
                        : "Index"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sitemap Inclusion:</span>
                    <Badge
                      variant={
                        finalRobotsMeta.includes("noindex")
                          ? "secondary"
                          : "default"
                      }
                    >
                      {finalRobotsMeta.includes("noindex")
                        ? "Excluded"
                        : "Included"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media (Enhanced) */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Graph & Social Media</CardTitle>
              <CardDescription>
                Optimize how your content appears when shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ogSiteName">Open Graph Site Name</Label>
                <Input
                  id="ogSiteName"
                  value={globalSEO.social.ogSiteName}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      social: {
                        ...globalSEO.social,
                        ogSiteName: e.target.value,
                      },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  How your site name appears on social media
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Twitter Card Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="twitterCard">Twitter Card Type</Label>
                  <Select
                    value={pageSEO.twitterCard || globalSEO.social.twitterCard}
                    onValueChange={(value: any) =>
                      handlePageSEOChange({ twitterCard: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Twitter card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">
                        Summary Large Image
                      </SelectItem>
                      <SelectItem value="app">App</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Current page override:{" "}
                    {pageSEO.twitterCard || "Using global"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterSite">Twitter Username</Label>
                  <Input
                    id="twitterSite"
                    value={globalSEO.social.twitterSite}
                    onChange={(e) =>
                      setGlobalSEO({
                        ...globalSEO,
                        social: {
                          ...globalSEO.social,
                          twitterSite: e.target.value,
                        },
                      })
                    }
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookAppId">Facebook App ID</Label>
                <Input
                  id="facebookAppId"
                  value={globalSEO.social.facebookAppId}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      social: {
                        ...globalSEO.social,
                        facebookAppId: e.target.value,
                      },
                    })
                  }
                  placeholder="Optional"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Current Page Social Preview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>OG Image</Label>
                    <div className="border rounded-lg p-4">
                      {finalOgImage ? (
                        <div className="aspect-video bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No image set
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter Card Type</Label>
                    <div className="border rounded-lg p-4">
                      <Badge>
                        {pageSEO.twitterCard || globalSEO.social.twitterCard}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        {pageSEO.twitterCard
                          ? "Page override"
                          : "Global setting"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schema Markup (Enhanced) */}
        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Structured Data (Schema.org)</CardTitle>
              <CardDescription>
                Help search engines understand your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Organization Schema</h4>
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={globalSEO.schemaData.organizationName}
                    onChange={(e) =>
                      setGlobalSEO({
                        ...globalSEO,
                        schemaData: {
                          ...globalSEO.schemaData,
                          organizationName: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Input
                    id="orgType"
                    value={globalSEO.schemaData.organizationType}
                    onChange={(e) =>
                      setGlobalSEO({
                        ...globalSEO,
                        schemaData: {
                          ...globalSEO.schemaData,
                          organizationType: e.target.value,
                        },
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    E.g., Organization, Corporation, LocalBusiness, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logo"
                      value={globalSEO.schemaData.logo}
                      onChange={(e) =>
                        setGlobalSEO({
                          ...globalSEO,
                          schemaData: {
                            ...globalSEO.schemaData,
                            logo: e.target.value,
                          },
                        })
                      }
                    />
                    <Button variant="outline">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Social Profile URLs</Label>
                  {globalSEO.schemaData.socialProfiles.map((profile, index) => (
                    <Input
                      key={index}
                      value={profile}
                      onChange={(e) => {
                        const newProfiles = [
                          ...globalSEO.schemaData.socialProfiles,
                        ];
                        newProfiles[index] = e.target.value;
                        setGlobalSEO({
                          ...globalSEO,
                          schemaData: {
                            ...globalSEO.schemaData,
                            socialProfiles: newProfiles,
                          },
                        });
                      }}
                    />
                  ))}
                  <Button variant="outline" size="sm">
                    Add Profile
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Page-Level Schema</h4>
                <div className="space-y-2">
                  <Label>Current Page Schema Type</Label>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{pageSEO.schemaType}</span>
                      <Badge>
                        {pageSEO.schemaType === "WebPage"
                          ? "Default"
                          : "Custom"}
                      </Badge>
                    </div>
                    {pageSEO.schemaType !== "WebPage" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Custom schema applied to this page
                      </p>
                    )}
                  </div>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="preview">
                    <AccordionTrigger>
                      Preview Generated Schema
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                        {JSON.stringify(
                          generateSchemaMarkup(pageSEO, globalSEO, activePage),
                          null,
                          2
                        )}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics (Existing) */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
              <CardDescription>
                Integrate analytics and tracking tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gaId">Google Analytics ID</Label>
                <Input
                  id="gaId"
                  value={globalSEO.analytics.googleAnalyticsId}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      analytics: {
                        ...globalSEO.analytics,
                        googleAnalyticsId: e.target.value,
                      },
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                />
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      globalSEO.analytics.googleAnalyticsId
                        ? "default"
                        : "secondary"
                    }
                  >
                    {globalSEO.analytics.googleAnalyticsId
                      ? "Connected"
                      : "Not Connected"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gtmId">Google Tag Manager ID</Label>
                <Input
                  id="gtmId"
                  value={globalSEO.analytics.googleTagManagerId}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      analytics: {
                        ...globalSEO.analytics,
                        googleTagManagerId: e.target.value,
                      },
                    })
                  }
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fbPixel">Facebook Pixel ID</Label>
                <Input
                  id="fbPixel"
                  value={globalSEO.analytics.facebookPixelId}
                  onChange={(e) =>
                    setGlobalSEO({
                      ...globalSEO,
                      analytics: {
                        ...globalSEO.analytics,
                        facebookPixelId: e.target.value,
                      },
                    })
                  }
                  placeholder="XXXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced SEO Settings</CardTitle>
              <CardDescription>
                Advanced controls for SEO experts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Robots Directives</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxImagePreview">Max Image Preview</Label>
                    <Select
                      value={pageSEO.robots.maxImagePreview}
                      onValueChange={(value: any) =>
                        handlePageSEOChange({
                          robots: { ...pageSEO.robots, maxImagePreview: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxSnippet">Max Snippet Length</Label>
                    <Input
                      id="maxSnippet"
                      type="number"
                      value={pageSEO.robots.maxSnippet}
                      onChange={(e) =>
                        handlePageSEOChange({
                          robots: {
                            ...pageSEO.robots,
                            maxSnippet: parseInt(e.target.value) || -1,
                          },
                        })
                      }
                      placeholder="-1 for no limit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxVideoPreview">Max Video Preview</Label>
                    <Input
                      id="maxVideoPreview"
                      type="number"
                      value={pageSEO.robots.maxVideoPreview}
                      onChange={(e) =>
                        handlePageSEOChange({
                          robots: {
                            ...pageSEO.robots,
                            maxVideoPreview: parseInt(e.target.value) || -1,
                          },
                        })
                      }
                      placeholder="Seconds"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Breadcrumbs</h4>
                <div className="space-y-2">
                  {pageSEO.breadcrumbs?.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={crumb.name}
                        onChange={(e) => {
                          const newBreadcrumbs = [
                            ...(pageSEO.breadcrumbs || []),
                          ];
                          newBreadcrumbs[index] = {
                            ...crumb,
                            name: e.target.value,
                          };
                          handlePageSEOChange({ breadcrumbs: newBreadcrumbs });
                        }}
                        placeholder="Breadcrumb name"
                      />
                      <Input
                        value={crumb.url}
                        onChange={(e) => {
                          const newBreadcrumbs = [
                            ...(pageSEO.breadcrumbs || []),
                          ];
                          newBreadcrumbs[index] = {
                            ...crumb,
                            url: e.target.value,
                          };
                          handlePageSEOChange({ breadcrumbs: newBreadcrumbs });
                        }}
                        placeholder="URL"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newBreadcrumbs = [
                            ...(pageSEO.breadcrumbs || []),
                          ];
                          newBreadcrumbs.splice(index, 1);
                          handlePageSEOChange({ breadcrumbs: newBreadcrumbs });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newBreadcrumbs = [
                        ...(pageSEO.breadcrumbs || []),
                        {
                          name: "",
                          url: "",
                          position: (pageSEO.breadcrumbs?.length || 0) + 1,
                        },
                      ];
                      handlePageSEOChange({ breadcrumbs: newBreadcrumbs });
                    }}
                  >
                    Add Breadcrumb
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Export SEO Data</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const data = prepareSeoData();
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `seo-${activePage.id}.json`;
                      a.click();
                    }}
                  >
                    Export JSON
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const data = generateSchemaMarkup(
                        pageSEO,
                        globalSEO,
                        activePage
                      );
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/ld+json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `schema-${activePage.id}.jsonld`;
                      a.click();
                    }}
                  >
                    Export Schema
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SEO Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>SEO Preview</DialogTitle>
            <DialogDescription>
              Preview how your page will appear in search results and social
              media
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="google">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="google">Google Search</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
            </TabsList>

            <TabsContent value="google" className="space-y-4">
              <div className="border rounded-lg p-6">
                <div className="space-y-2">
                  <div className="text-blue-800 text-xl hover:underline cursor-pointer">
                    {pageSEO.title || activePage.title}{" "}
                    {globalSEO.general.siteTitleSeparator}{" "}
                    {globalSEO.general.siteTitle}
                  </div>
                  <div className="text-green-700 text-sm">{finalCanonical}</div>
                  <div className="text-gray-600">
                    {pageSEO.metaDescription ||
                      globalSEO.general.metaDescription}
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  <div>
                    Title: {(pageSEO.title || activePage.title).length}{" "}
                    characters
                  </div>
                  <div>
                    Description:{" "}
                    {
                      (
                        pageSEO.metaDescription ||
                        globalSEO.general.metaDescription
                      ).length
                    }{" "}
                    characters
                  </div>
                  <div>Canonical: {finalCanonical}</div>
                  <div>Robots: {finalRobotsMeta}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="facebook" className="space-y-4">
              <div className="border rounded-lg p-6">
                <div className="max-w-md mx-auto border rounded-lg overflow-hidden">
                  {finalOgImage ? (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <div className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                        {globalSEO.general.siteUrl.replace("https://", "")}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-blue-600 text-sm uppercase">
                      {globalSEO.social.ogSiteName}
                    </div>
                    <div className="font-bold mt-1">
                      {pageSEO.title || activePage.title}
                    </div>
                    <div className="text-gray-600 text-sm mt-2">
                      {pageSEO.metaDescription ||
                        globalSEO.general.metaDescription}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="twitter" className="space-y-4">
              <div className="border rounded-lg p-6">
                <div className="max-w-md mx-auto border rounded-lg overflow-hidden">
                  {finalOgImage ? (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">
                          {globalSEO.social.ogSiteName}
                        </div>
                        <div className="text-gray-600 text-sm">
                          @{globalSEO.social.twitterSite.replace("@", "")}
                        </div>
                      </div>
                      <div className="text-blue-500">Follow</div>
                    </div>
                    <div className="mt-3">
                      <div className="font-bold">
                        {pageSEO.title || activePage.title}
                      </div>
                      <div className="text-gray-600 mt-1">
                        {pageSEO.metaDescription ||
                          globalSEO.general.metaDescription}
                      </div>
                      <div className="text-blue-500 text-sm mt-2">
                        {finalCanonical}
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Card:{" "}
                      {pageSEO.twitterCard || globalSEO.social.twitterCard}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
