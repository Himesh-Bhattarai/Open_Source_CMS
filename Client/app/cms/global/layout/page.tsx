"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LayoutThemePage() {
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    branding: {
      logoLight: null as File | null,
      logoDark: null as File | null,
      favicon: null as File | null,
      siteTitle: "ContentFlow",
      tagline: "Building the future",
    },
    header: {
      style: "sticky",
      layout: "centered",
      ctaEnabled: true,
      ctaText: "Get Started",
      ctaLink: "/signup",
    },
    footer: {
      variant: "multi-column",
      showCopyright: true,
      copyrightText: "© 2025 Company Inc.",
      showSocial: true,
    },
    theme: {
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      background: "#FFFFFF",
      textColor: "#1F2937",
      accentColor: "#F59E0B",
      darkMode: true,
    },
    typography: {
      bodyFont: "Inter",
      headingFont: "Inter",
      fontSize: "16px",
    },
  })

  const handleSave = () => {
    console.log("[v0] Saving layout settings:", settings)
    toast({
      title: "Settings saved",
      description: "Your layout and theme settings have been updated.",
    })
  }

  const handleFileUpload = (type: "logoLight" | "logoDark" | "favicon", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSettings({
        ...settings,
        branding: { ...settings.branding, [type]: file },
      })
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Layout & Theme</h1>
          <p className="text-pretty text-muted-foreground mt-1">Customize your site's appearance and branding</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>Upload your logo and site identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Logo (Light Mode)</Label>
                  <label htmlFor="logo-light" className="block">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">SVG, PNG (Max 2MB)</p>
                      {settings.branding.logoLight && (
                        <p className="text-xs text-primary mt-2">✓ {settings.branding.logoLight.name}</p>
                      )}
                    </div>
                  </label>
                  <input
                    id="logo-light"
                    type="file"
                    accept="image/svg+xml,image/png"
                    className="hidden"
                    onChange={(e) => handleFileUpload("logoLight", e)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo (Dark Mode)</Label>
                  <label htmlFor="logo-dark" className="block">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">SVG, PNG (Max 2MB)</p>
                      {settings.branding.logoDark && (
                        <p className="text-xs text-primary mt-2">✓ {settings.branding.logoDark.name}</p>
                      )}
                    </div>
                  </label>
                  <input
                    id="logo-dark"
                    type="file"
                    accept="image/svg+xml,image/png"
                    className="hidden"
                    onChange={(e) => handleFileUpload("logoDark", e)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Favicon</Label>
                <label htmlFor="favicon" className="block">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer w-48">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">32x32 icon</p>
                    {settings.branding.favicon && (
                      <p className="text-xs text-primary mt-2">✓ {settings.branding.favicon.name}</p>
                    )}
                  </div>
                </label>
                <input
                  id="favicon"
                  type="file"
                  accept="image/x-icon,image/png"
                  className="hidden"
                  onChange={(e) => handleFileUpload("favicon", e)}
                />
              </div>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input
                    id="site-title"
                    value={settings.branding.siteTitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: { ...settings.branding, siteTitle: e.target.value },
                      })
                    }
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.branding.tagline}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: { ...settings.branding, tagline: e.target.value },
                      })
                    }
                    placeholder="Building the future"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Define your brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Primary Color", key: "primaryColor" as const },
                { label: "Secondary Color", key: "secondaryColor" as const },
                { label: "Background", key: "background" as const },
                { label: "Text Color", key: "textColor" as const },
                { label: "Accent Color", key: "accentColor" as const },
              ].map((color) => (
                <div key={color.key} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-sm">{color.label}</Label>
                  </div>
                  <Input
                    type="color"
                    value={settings.theme[color.key]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        theme: { ...settings.theme, [color.key]: e.target.value },
                      })
                    }
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    value={settings.theme[color.key]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        theme: { ...settings.theme, [color.key]: e.target.value },
                      })
                    }
                    className="w-32 font-mono text-sm"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dark Mode</CardTitle>
              <CardDescription>Enable automatic dark mode support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Automatically adapt colors for dark theme</p>
                </div>
                <Switch
                  checked={settings.theme.darkMode}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, darkMode: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Header Settings</CardTitle>
              <CardDescription>Configure site header behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Header Style</Label>
                <RadioGroup
                  value={settings.header.style}
                  onValueChange={(value) => setSettings({ ...settings, header: { ...settings.header, style: value } })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="font-normal cursor-pointer">
                      Fixed - Always visible at top
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sticky" id="sticky" />
                    <Label htmlFor="sticky" className="font-normal cursor-pointer">
                      Sticky - Hides on scroll down, shows on scroll up
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="font-normal cursor-pointer">
                      Standard - Scrolls with page
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Header Layout</Label>
                <RadioGroup
                  value={settings.header.layout}
                  onValueChange={(value) => setSettings({ ...settings, header: { ...settings.header, layout: value } })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="centered" id="centered" />
                    <Label htmlFor="centered" className="font-normal cursor-pointer">
                      Centered Logo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="left" />
                    <Label htmlFor="left" className="font-normal cursor-pointer">
                      Left Logo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="split" id="split" />
                    <Label htmlFor="split" className="font-normal cursor-pointer">
                      Split Navigation
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>CTA Button</Label>
                    <p className="text-xs text-muted-foreground">Show call-to-action in header</p>
                  </div>
                  <Switch
                    checked={settings.header.ctaEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, header: { ...settings.header, ctaEnabled: checked } })
                    }
                  />
                </div>
                {settings.header.ctaEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cta-text">Button Text</Label>
                      <Input
                        id="cta-text"
                        value={settings.header.ctaText}
                        onChange={(e) =>
                          setSettings({ ...settings, header: { ...settings.header, ctaText: e.target.value } })
                        }
                        placeholder="Get Started"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cta-link">Button Link</Label>
                      <Input
                        id="cta-link"
                        value={settings.header.ctaLink}
                        onChange={(e) =>
                          setSettings({ ...settings, header: { ...settings.header, ctaLink: e.target.value } })
                        }
                        placeholder="/signup"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Settings</CardTitle>
              <CardDescription>Configure site footer appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Footer Variant</Label>
                <RadioGroup
                  value={settings.footer.variant}
                  onValueChange={(value) =>
                    setSettings({ ...settings, footer: { ...settings.footer, variant: value } })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multi-column" id="multi-column" />
                    <Label htmlFor="multi-column" className="font-normal cursor-pointer">
                      Multi-column
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal" className="font-normal cursor-pointer">
                      Minimal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="centered" id="centered-footer" />
                    <Label htmlFor="centered-footer" className="font-normal cursor-pointer">
                      Centered
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Copyright</Label>
                  <p className="text-xs text-muted-foreground">Display copyright text in footer</p>
                </div>
                <Switch
                  checked={settings.footer.showCopyright}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, footer: { ...settings.footer, showCopyright: checked } })
                  }
                />
              </div>

              {settings.footer.showCopyright && (
                <div className="space-y-2">
                  <Label htmlFor="copyright-text">Copyright Text</Label>
                  <Input
                    id="copyright-text"
                    value={settings.footer.copyrightText}
                    onChange={(e) =>
                      setSettings({ ...settings, footer: { ...settings.footer, copyrightText: e.target.value } })
                    }
                    placeholder="© 2025 Company Inc."
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Social Links</Label>
                  <p className="text-xs text-muted-foreground">Display social media icons</p>
                </div>
                <Switch
                  checked={settings.footer.showSocial}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, footer: { ...settings.footer, showSocial: checked } })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
              <CardDescription>Customize fonts and text styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="body-font">Body Font</Label>
                <Select
                  value={settings.typography.bodyFont}
                  onValueChange={(value) =>
                    setSettings({ ...settings, typography: { ...settings.typography, bodyFont: value } })
                  }
                >
                  <SelectTrigger id="body-font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading-font">Heading Font</Label>
                <Select
                  value={settings.typography.headingFont}
                  onValueChange={(value) =>
                    setSettings({ ...settings, typography: { ...settings.typography, headingFont: value } })
                  }
                >
                  <SelectTrigger id="heading-font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                    <SelectItem value="Merriweather">Merriweather</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Base Font Size</Label>
                <Select
                  value={settings.typography.fontSize}
                  onValueChange={(value) =>
                    setSettings({ ...settings, typography: { ...settings.typography, fontSize: value } })
                  }
                >
                  <SelectTrigger id="font-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14px">14px (Small)</SelectItem>
                    <SelectItem value="16px">16px (Default)</SelectItem>
                    <SelectItem value="18px">18px (Large)</SelectItem>
                    <SelectItem value="20px">20px (Extra Large)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
