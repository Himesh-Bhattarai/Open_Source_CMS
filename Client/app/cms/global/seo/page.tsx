"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Globe, ImageIcon, LinkIcon } from "lucide-react"

export default function SEOSettingsPage() {
  const [seoData, setSeoData] = useState({
    general: {
      siteTitle: "ContentFlow",
      siteTitleSeparator: "|",
      metaDescription: "Build and manage your websites with ContentFlow CMS",
      defaultOgImage: "/og-image.jpg",
      favicon: "/favicon.ico",
    },
    robots: {
      indexPages: true,
      followLinks: true,
      sitemapEnabled: true,
      sitemapUrl: "/sitemap.xml",
      robotsTxtEnabled: true,
    },
    social: {
      ogSiteName: "ContentFlow",
      twitterCard: "summary_large_image",
      twitterSite: "@contentflow",
      facebookAppId: "",
    },
    schema: {
      organizationName: "ContentFlow Inc.",
      organizationType: "Organization",
      logo: "/logo.svg",
      socialProfiles: ["https://twitter.com/contentflow", "https://facebook.com/contentflow"],
    },
    analytics: {
      googleAnalyticsId: "G-XXXXXXXXXX",
      googleTagManagerId: "",
      facebookPixelId: "",
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Settings</h1>
          <p className="text-muted-foreground">Optimize your site for search engines</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Warning Banner */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Global SEO Settings</p>
              <p className="text-sm text-muted-foreground">
                These settings apply to all pages unless overridden at the page level
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="robots">Robots & Sitemap</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="schema">Schema Markup</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General SEO Settings</CardTitle>
              <CardDescription>Default meta information for your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={seoData.general.siteTitle}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      general: { ...seoData.general, siteTitle: e.target.value },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">Your main site title (brand name)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="separator">Title Separator</Label>
                <Input
                  id="separator"
                  value={seoData.general.siteTitleSeparator}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      general: { ...seoData.general, siteTitleSeparator: e.target.value },
                    })
                  }
                  className="max-w-25"
                />
                <p className="text-xs text-muted-foreground">Character between page title and site name</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Default Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={seoData.general.metaDescription}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      general: { ...seoData.general, metaDescription: e.target.value },
                    })
                  }
                  rows={3}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Used when pages don't have their own description</span>
                  <span>{seoData.general.metaDescription.length} / 160 characters</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Default Open Graph Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="ogImage"
                    value={seoData.general.defaultOgImage}
                    onChange={(e) =>
                      setSeoData({
                        ...seoData,
                        general: { ...seoData.general, defaultOgImage: e.target.value },
                      })
                    }
                  />
                  <Button variant="outline">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended: 1200 x 630 pixels</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex gap-2">
                  <Input
                    id="favicon"
                    value={seoData.general.favicon}
                    onChange={(e) =>
                      setSeoData({
                        ...seoData,
                        general: { ...seoData.general, favicon: e.target.value },
                      })
                    }
                  />
                  <Button variant="outline">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Browser tab icon (32x32 .ico or .png)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Robots & Sitemap */}
        <TabsContent value="robots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Visibility</CardTitle>
              <CardDescription>Control how search engines crawl and index your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="indexPages">Index Pages</Label>
                  <p className="text-sm text-muted-foreground">Allow search engines to index your pages</p>
                </div>
                <Switch
                  id="indexPages"
                  checked={seoData.robots.indexPages}
                  onCheckedChange={(checked) =>
                    setSeoData({
                      ...seoData,
                      robots: { ...seoData.robots, indexPages: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="followLinks">Follow Links</Label>
                  <p className="text-sm text-muted-foreground">Allow search engines to follow links on your site</p>
                </div>
                <Switch
                  id="followLinks"
                  checked={seoData.robots.followLinks}
                  onCheckedChange={(checked) =>
                    setSeoData({
                      ...seoData,
                      robots: { ...seoData.robots, followLinks: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sitemap">XML Sitemap</Label>
                  <p className="text-sm text-muted-foreground">Automatically generate sitemap.xml</p>
                </div>
                <Switch
                  id="sitemap"
                  checked={seoData.robots.sitemapEnabled}
                  onCheckedChange={(checked) =>
                    setSeoData({
                      ...seoData,
                      robots: { ...seoData.robots, sitemapEnabled: checked },
                    })
                  }
                />
              </div>

              {seoData.robots.sitemapEnabled && (
                <div className="space-y-2 pl-4 border-l-2">
                  <Label htmlFor="sitemapUrl">Sitemap URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="sitemapUrl"
                      value={seoData.robots.sitemapUrl}
                      onChange={(e) =>
                        setSeoData({
                          ...seoData,
                          robots: { ...seoData.robots, sitemapUrl: e.target.value },
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
                  <p className="text-sm text-muted-foreground">Generate robots.txt file</p>
                </div>
                <Switch
                  id="robotsTxt"
                  checked={seoData.robots.robotsTxtEnabled}
                  onCheckedChange={(checked) =>
                    setSeoData({
                      ...seoData,
                      robots: { ...seoData.robots, robotsTxtEnabled: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Graph & Social Media</CardTitle>
              <CardDescription>Optimize how your content appears when shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ogSiteName">Open Graph Site Name</Label>
                <Input
                  id="ogSiteName"
                  value={seoData.social.ogSiteName}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      social: { ...seoData.social, ogSiteName: e.target.value },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">How your site name appears on social media</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterCard">Twitter Card Type</Label>
                <Input
                  id="twitterCard"
                  value={seoData.social.twitterCard}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      social: { ...seoData.social, twitterCard: e.target.value },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">summary, summary_large_image, app, or player</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterSite">Twitter Username</Label>
                <Input
                  id="twitterSite"
                  value={seoData.social.twitterSite}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      social: { ...seoData.social, twitterSite: e.target.value },
                    })
                  }
                  placeholder="@username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookAppId">Facebook App ID</Label>
                <Input
                  id="facebookAppId"
                  value={seoData.social.facebookAppId}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      social: { ...seoData.social, facebookAppId: e.target.value },
                    })
                  }
                  placeholder="Optional"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schema Markup */}
        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Structured Data (Schema.org)</CardTitle>
              <CardDescription>Help search engines understand your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={seoData.schema.organizationName}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      schema: { ...seoData.schema, organizationName: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgType">Organization Type</Label>
                <Input
                  id="orgType"
                  value={seoData.schema.organizationType}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      schema: { ...seoData.schema, organizationType: e.target.value },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">E.g., Organization, Corporation, LocalBusiness, etc.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="logo"
                    value={seoData.schema.logo}
                    onChange={(e) =>
                      setSeoData({
                        ...seoData,
                        schema: { ...seoData.schema, logo: e.target.value },
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
                {seoData.schema.socialProfiles.map((profile, index) => (
                  <Input
                    key={index}
                    value={profile}
                    onChange={(e) => {
                      const newProfiles = [...seoData.schema.socialProfiles]
                      newProfiles[index] = e.target.value
                      setSeoData({
                        ...seoData,
                        schema: { ...seoData.schema, socialProfiles: newProfiles },
                      })
                    }}
                  />
                ))}
                <Button variant="outline" size="sm">
                  Add Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
              <CardDescription>Integrate analytics and tracking tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gaId">Google Analytics ID</Label>
                <Input
                  id="gaId"
                  value={seoData.analytics.googleAnalyticsId}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      analytics: { ...seoData.analytics, googleAnalyticsId: e.target.value },
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                />
                <div className="flex items-center gap-2">
                  <Badge variant={seoData.analytics.googleAnalyticsId ? "default" : "secondary"}>
                    {seoData.analytics.googleAnalyticsId ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gtmId">Google Tag Manager ID</Label>
                <Input
                  id="gtmId"
                  value={seoData.analytics.googleTagManagerId}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      analytics: { ...seoData.analytics, googleTagManagerId: e.target.value },
                    })
                  }
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fbPixel">Facebook Pixel ID</Label>
                <Input
                  id="fbPixel"
                  value={seoData.analytics.facebookPixelId}
                  onChange={(e) =>
                    setSeoData({
                      ...seoData,
                      analytics: { ...seoData.analytics, facebookPixelId: e.target.value },
                    })
                  }
                  placeholder="XXXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
