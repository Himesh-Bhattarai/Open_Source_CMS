"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Search,
    Globe,
    MessageSquare,
    Twitter,
    CheckCircle2,
    AlertCircle,
    Eye,
    ExternalLink,
    Lock,
    BarChart3,
    Sparkles,
    Link,
    Image
} from "lucide-react"
import { fetchSeo } from "@/Api/Seo/Fetch"

interface SEOSource {
    type: "global" | "page"
    field: string
}

interface SEOShowcaseData {
    _id: string
    scope: "global" | "page"
    globalSEO: {
        general: {
            siteTitle: string
            siteTitleSeparator: string
            metaDescription: string
            defaultOgImage: string
            favicon: string
            siteUrl: string
        }
        robots: {
            indexPages: boolean
            followLinks: boolean
            sitemapEnabled: boolean
        }
        social: {
            ogSiteName: string
            twitterCard: string
            twitterSite: string
        }
    }
    pageSEO?: {
        title: string
        metaDescription: string
        canonicalUrl: string
        robots: {
            index: boolean
            follow: boolean
        }
        ogImage: string
        ogTitle: string
        ogDescription: string
        twitterTitle: string
        twitterDescription: string
        twitterImage: string
    }
    meta: {
        environment: string
    }
}

export default function SEOShowcaseDashboard() {
    const [seoData, setSeoData] = useState<SEOShowcaseData | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("google")

    // Helper to determine source and value
    const getValueWithSource = (field: keyof SEOShowcaseData['globalSEO']['general'] | keyof SEOShowcaseData['pageSEO']) => {
        if (!seoData) return { value: "", source: "global" as const }

        // If pageSEO exists and has the field, use it
        if (seoData.pageSEO && field in seoData.pageSEO) {
            return {
                value: (seoData.pageSEO as any)[field] || (seoData.globalSEO.general as any)[field] || "",
                source: (seoData.pageSEO as any)[field] ? "page" : "global" as const
            }
        }

        // Otherwise use global
        return {
            value: (seoData.globalSEO.general as any)[field] || "",
            source: "global" as const
        }
    }

    // Get page title with separator
    const getPageTitle = () => {
        if (!seoData) return ""

        const titleData = getValueWithSource("siteTitle")
        const siteTitle = seoData.globalSEO.general.siteTitle
        const separator = seoData.globalSEO.general.siteTitleSeparator

        if (titleData.source === "page" && titleData.value) {
            return `${titleData.value} ${separator} ${siteTitle}`
        }

        return siteTitle
    }

    // Get meta description
    const getMetaDescription = () => {
        return getValueWithSource("metaDescription")
    }

    // Get canonical URL
    const getCanonicalUrl = () => {
        if (!seoData) return ""

        if (seoData.pageSEO?.canonicalUrl) {
            return seoData.pageSEO.canonicalUrl
        }

        return seoData.globalSEO.general.siteUrl
    }

    // Get OG Image
    const getOgImage = () => {
        if (!seoData) return ""

        if (seoData.pageSEO?.ogImage) {
            return seoData.pageSEO.ogImage
        }

        return seoData.globalSEO.general.defaultOgImage
    }

    // Get OG Title
    const getOgTitle = () => {
        if (!seoData) return ""

        if (seoData.pageSEO?.ogTitle) {
            return seoData.pageSEO.ogTitle
        }

        return getPageTitle()
    }

    // Get OG Description
    const getOgDescription = () => {
        if (!seoData) return ""

        if (seoData.pageSEO?.ogDescription) {
            return seoData.pageSEO.ogDescription
        }

        return getMetaDescription().value
    }

    // Get Twitter Title
    const getTwitterTitle = () => {
        if (!seoData) return ""

        if (seoData.pageSEO?.twitterTitle) {
            return seoData.pageSEO.twitterTitle
        }

        if (seoData.pageSEO?.ogTitle) {
            return seoData.pageSEO.ogTitle
        }

        return getPageTitle()
    }

    // Get Twitter Description
    const getTwitterDescription = () => {
        if (!seoData) return ""

        if (seoData.pageSEO?.twitterDescription) {
            return seoData.pageSEO.twitterDescription
        }

        if (seoData.pageSEO?.ogDescription) {
            return seoData.pageSEO.ogDescription
        }

        return getMetaDescription().value
    }

    // Get Twitter Image
    const getTwitterImage = () => {
        if (!seoData) return ""

        if (seoData.pageSEO?.twitterImage) {
            return seoData.pageSEO.twitterImage
        }

        return getOgImage()
    }

    // Check if page is indexable
    const getIndexability = () => {
        if (!seoData) return { indexable: false, source: "global" as const }

        if (seoData.pageSEO?.robots) {
            return {
                indexable: seoData.pageSEO.robots.index && seoData.pageSEO.robots.follow,
                source: "page" as const
            }
        }

        return {
            indexable: seoData.globalSEO.robots.indexPages && seoData.globalSEO.robots.followLinks,
            source: "global" as const
        }
    }

    // Check if sitemap is enabled
    const getSitemapStatus = () => {
        if (!seoData) return false
        return seoData.globalSEO.robots.sitemapEnabled
    }

    // Get SEO Health Score
    const getSEOHealth = () => {
        if (!seoData) return { score: 0, issues: [] }

        const issues: string[] = []
        let score = 100

        // Check title
        const title = getPageTitle()
        if (!title || title.length < 10 || title.length > 60) {
            issues.push("Title length should be 10-60 characters")
            score -= 20
        }

        // Check description
        const desc = getMetaDescription()
        if (!desc.value || desc.value.length < 50 || desc.value.length > 160) {
            issues.push("Meta description should be 50-160 characters")
            score -= 20
        }

        // Check OG image
        if (!getOgImage()) {
            issues.push("Missing Open Graph image")
            score -= 15
        }

        // Check canonical URL
        if (!getCanonicalUrl()) {
            issues.push("Missing canonical URL")
            score -= 15
        }

        // Check indexability
        const { indexable } = getIndexability()
        if (!indexable) {
            issues.push("Page may not be indexed by search engines")
            score -= 10
        }

        return { score: Math.max(0, score), issues }
    }

    // Fetch SEO data
    useEffect(() => {
        const loadSEO = async () => {
            try {
                setLoading(true)
                const data = await fetchSeo()
                console.log("Is response comming")
                console.log("Raw Data", data)
                setSeoData(data)
            } catch (error) {
                console.error("Failed to load SEO data:", error)
            } finally {
                setLoading(false)
            }
        }

        loadSEO()
    }, [])

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[300px] w-full" />
                    <Skeleton className="h-[300px] w-full" />
                </div>
                <Skeleton className="h-[200px] w-full" />
            </div>
        )
    }

    if (!seoData) {
        return (
            <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No SEO Data Available</h3>
                <p className="text-muted-foreground mb-6">
                    SEO settings haven't been configured yet.
                </p>
                <Button>
                    Configure SEO
                </Button>
            </div>
        )
    }

    const health = getSEOHealth()
    const indexability = getIndexability()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SEO Preview</h1>
                    <p className="text-muted-foreground mt-2">
                        See how your page appears in search results and social media
                    </p>
                </div>
                <Button>
                    Edit SEO Settings
                </Button>
            </div>

            {/* Source Indicator */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${seoData.scope === "global" ? "bg-blue-500" : "bg-green-500"}`} />
                    <span className="text-sm font-medium">
                        {seoData.scope === "global" ? "Global SEO Settings" : "Page-Specific SEO Settings"}
                    </span>
                </div>
                <div className="text-sm text-muted-foreground">
                    {seoData.scope === "global"
                        ? "Settings apply to all pages on your site"
                        : "These settings override global defaults for this page"}
                </div>
            </div>

            {/* Preview Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="google" className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Google Search
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Social Media
                    </TabsTrigger>
                    <TabsTrigger value="health" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        SEO Health
                    </TabsTrigger>
                </TabsList>

                {/* Google Search Preview */}
                <TabsContent value="google" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                How your page appears on Google
                            </CardTitle>
                            <CardDescription>
                                This is what users see in search results
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Google Search Result Preview */}
                            <div className="border rounded-lg p-6 space-y-3 bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-green-700 truncate">
                                            {getCanonicalUrl().replace(/^https?:\/\//, "")}
                                        </span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        Source: {getValueWithSource("title" as "siteTitle").source}
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="text-xl text-blue-700 hover:underline cursor-pointer font-medium">
                                        {getPageTitle()}
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">
                                        {getMetaDescription().value}
                                    </p>
                                </div>
                            </div>

                            {/* Key Information */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">Search Visibility</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Indexable by Google</span>
                                        <div className="flex items-center gap-2">
                                            {indexability.indexable ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                            )}
                                            <Badge variant="outline" className="text-xs">
                                                {indexability.source}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Canonical URL</span>
                                        <div className="flex items-center gap-2">
                                            {getCanonicalUrl() ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                {getCanonicalUrl() || "Not set"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">Content Guidelines</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Title Length</span>
                                        <span className={`text-sm ${getPageTitle().length >= 10 && getPageTitle().length <= 60 ? 'text-green-600' : 'text-amber-600'}`}>
                                            {getPageTitle().length} characters
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Description Length</span>
                                        <span className={`text-sm ${getMetaDescription().value.length >= 50 && getMetaDescription().value.length <= 160 ? 'text-green-600' : 'text-amber-600'}`}>
                                            {getMetaDescription().value.length} characters
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Media Preview */}
                <TabsContent value="social" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Facebook Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Facebook Share Preview
                                </CardTitle>
                                <CardDescription>
                                    How your link appears when shared on Facebook
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border rounded-lg overflow-hidden bg-[#f0f2f5]">
                                    {getOgImage() ? (
                                        <div className="aspect-[1.91/1] bg-muted">
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <Image className="h-8 w-8 text-gray-400" />
                                                <span className="text-sm text-gray-500 ml-2">Image: {getOgImage()}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-[1.91/1] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <AlertCircle className="h-8 w-8 text-gray-400" />
                                            <span className="text-sm text-gray-500 ml-2">No image set</span>
                                        </div>
                                    )}

                                    <div className="p-4 space-y-2 bg-white">
                                        <div className="text-xs text-gray-500 uppercase">
                                            {seoData.globalSEO.social.ogSiteName || seoData.globalSEO.general.siteUrl}
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {getOgTitle()}
                                        </div>
                                        <div className="text-sm text-gray-600 line-clamp-2">
                                            {getOgDescription()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Image Source</span>
                                        <Badge variant="outline" className="text-xs">
                                            {getOgImage() === seoData.pageSEO?.ogImage ? "Page" :
                                                getOgImage() === seoData.globalSEO.general.defaultOgImage ? "Global" : "None"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Title Source</span>
                                        <Badge variant="outline" className="text-xs">
                                            {seoData.pageSEO?.ogTitle ? "Page" : "Global"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Twitter Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Twitter className="h-5 w-5" />
                                    Twitter Card Preview
                                </CardTitle>
                                <CardDescription>
                                    How your link appears when shared on Twitter
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border rounded-lg overflow-hidden bg-white">
                                    {getTwitterImage() ? (
                                        <div className="aspect-[1.91/1] bg-muted">
                                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                                <Image className="h-8 w-8 text-blue-400" />
                                                <span className="text-sm text-blue-500 ml-2">Image loaded</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-[1.91/1] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                            <AlertCircle className="h-8 w-8 text-blue-400" />
                                            <span className="text-sm text-blue-500 ml-2">No image set</span>
                                        </div>
                                    )}

                                    <div className="p-4 space-y-2">
                                        <div className="font-bold text-gray-900">
                                            {getTwitterTitle()}
                                        </div>
                                        <div className="text-sm text-gray-600 line-clamp-2">
                                            {getTwitterDescription()}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <span>{seoData.globalSEO.social.twitterSite || seoData.globalSEO.general.siteUrl}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Card Type</span>
                                        <Badge variant="outline" className="text-xs">
                                            {seoData.globalSEO.social.twitterCard}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Twitter Handle</span>
                                        <Badge variant="outline" className="text-xs">
                                            {seoData.globalSEO.social.twitterSite || "Not set"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* SEO Health Check */}
                <TabsContent value="health" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                SEO Health Check
                            </CardTitle>
                            <CardDescription>
                                Technical health of your page's SEO implementation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Health Score */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Overall SEO Health</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Based on best practices for search visibility
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-3xl font-bold ${health.score >= 80 ? 'text-green-600' :
                                                health.score >= 60 ? 'text-amber-600' : 'text-red-600'
                                            }`}>
                                            {health.score}/100
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {health.score >= 80 ? 'Excellent' :
                                                health.score >= 60 ? 'Good' : 'Needs improvement'}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${health.score >= 80 ? 'bg-green-500' :
                                                health.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${health.score}%` }}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Checks */}
                            <div className="space-y-4">
                                <h4 className="font-medium">Technical Checks</h4>

                                <div className="space-y-3">
                                    {/* Indexability Check */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            {indexability.indexable ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                            )}
                                            <div>
                                                <div className="font-medium text-sm">Search Engine Indexing</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {indexability.indexable
                                                        ? "Your page can be indexed by search engines"
                                                        : "Your page may not appear in search results"}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{indexability.source}</Badge>
                                    </div>

                                    {/* Sitemap Check */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            {getSitemapStatus() ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                            )}
                                            <div>
                                                <div className="font-medium text-sm">Sitemap</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {getSitemapStatus()
                                                        ? "Sitemap helps search engines discover your pages"
                                                        : "Sitemap not enabled"}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline">Global</Badge>
                                    </div>

                                    {/* Canonical URL Check */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            {getCanonicalUrl() ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-red-500" />
                                            )}
                                            <div>
                                                <div className="font-medium text-sm">Canonical URL</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {getCanonicalUrl()
                                                        ? "Tells search engines which URL is the main version"
                                                        : "Missing canonical URL"}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            {seoData.pageSEO?.canonicalUrl ? "Page" : "Global"}
                                        </Badge>
                                    </div>

                                    {/* Social Metadata Check */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            {getOgImage() ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                            )}
                                            <div>
                                                <div className="font-medium text-sm">Social Media Ready</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {getOgImage()
                                                        ? "Your page looks great when shared on social media"
                                                        : "Missing social media image"}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            {getOgImage() === seoData.pageSEO?.ogImage ? "Page" : "Global"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Issues List */}
                            {health.issues.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm text-amber-600">Areas for Improvement</h4>
                                        <ul className="space-y-2">
                                            {health.issues.map((issue, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                                    <span>{issue}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Source</p>
                                <p className="text-2xl font-bold mt-1">
                                    {seoData.scope === "global" ? "Global" : "Page"}
                                </p>
                            </div>
                            <Globe className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">Indexable</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {indexability.indexable ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                    )}
                                    <span className="text-2xl font-bold">
                                        {indexability.indexable ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>
                            <Lock className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">Social Ready</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {getOgImage() ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    )}
                                    <span className="text-2xl font-bold">
                                        {getOgImage() ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>
                            <MessageSquare className="h-8 w-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700">SEO Score</p>
                                <p className="text-2xl font-bold mt-1">
                                    {health.score}
                                </p>
                            </div>
                            <Sparkles className="h-8 w-8 text-amber-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}