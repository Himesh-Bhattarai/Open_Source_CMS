"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Palette, Type, LayoutIcon, Sparkles } from "lucide-react"

export default function ThemePage() {
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6")
  const [secondaryColor, setSecondaryColor] = useState("#10b981")
  const [fontHeading, setFontHeading] = useState("Inter")
  const [fontBody, setFontBody] = useState("Inter")

  const presetThemes = [
    { name: "Default", primary: "#8b5cf6", secondary: "#10b981" },
    { name: "Ocean", primary: "#0ea5e9", secondary: "#06b6d4" },
    { name: "Forest", primary: "#10b981", secondary: "#84cc16" },
    { name: "Sunset", primary: "#f97316", secondary: "#f59e0b" },
    { name: "Rose", primary: "#f43f5e", secondary: "#ec4899" },
    { name: "Midnight", primary: "#6366f1", secondary: "#8b5cf6" },
  ]

  const fonts = ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Playfair Display", "Merriweather"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-3xl font-bold tracking-tight">Theme Customization</h1>
        <p className="text-pretty text-muted-foreground mt-1">
          Customize colors, fonts, and layout to match your brand
        </p>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout">
            <LayoutIcon className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="presets">
            <Sparkles className="h-4 w-4 mr-2" />
            Presets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Define your primary and secondary brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                  </div>
                  <p className="text-xs text-muted-foreground">Used for buttons, links, and accents</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Used for secondary actions and highlights</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Color Preview</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: primaryColor }}>
                    <p className="text-white font-medium">Primary</p>
                    <p className="text-white/80 text-sm mt-1">Buttons & Links</p>
                  </div>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: secondaryColor }}>
                    <p className="text-white font-medium">Secondary</p>
                    <p className="text-white/80 text-sm mt-1">Accents & Highlights</p>
                  </div>
                  <div className="p-6 rounded-lg border bg-background">
                    <p className="font-medium">Background</p>
                    <p className="text-muted-foreground text-sm mt-1">Page Background</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Choose fonts for headings and body text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="heading-font">Heading Font</Label>
                  <Select value={fontHeading} onValueChange={setFontHeading}>
                    <SelectTrigger id="heading-font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Used for all headings and titles</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body-font">Body Font</Label>
                  <Select value={fontBody} onValueChange={setFontBody}>
                    <SelectTrigger id="body-font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Used for paragraphs and body text</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Typography Preview</h3>
                <div className="space-y-4 p-6 rounded-lg border bg-muted/30">
                  <h1 className="text-4xl font-bold" style={{ fontFamily: fontHeading }}>
                    Heading Level 1
                  </h1>
                  <h2 className="text-3xl font-bold" style={{ fontFamily: fontHeading }}>
                    Heading Level 2
                  </h2>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: fontHeading }}>
                    Heading Level 3
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: fontBody }}>
                    This is sample body text. The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Configure spacing, borders, and container widths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="container-width">Container Width</Label>
                  <Select defaultValue="1280">
                    <SelectTrigger id="container-width">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024">1024px - Narrow</SelectItem>
                      <SelectItem value="1280">1280px - Default</SelectItem>
                      <SelectItem value="1536">1536px - Wide</SelectItem>
                      <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="border-radius">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None - Sharp Corners</SelectItem>
                      <SelectItem value="small">Small - 4px</SelectItem>
                      <SelectItem value="medium">Medium - 8px</SelectItem>
                      <SelectItem value="large">Large - 16px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section-spacing">Section Spacing</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger id="section-spacing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header-style">Header Style</Label>
                  <Select defaultValue="fixed">
                    <SelectTrigger id="header-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed - Always Visible</SelectItem>
                      <SelectItem value="sticky">Sticky - Hides on Scroll</SelectItem>
                      <SelectItem value="static">Static - Scrolls Away</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Presets</CardTitle>
              <CardDescription>Start with a pre-designed theme and customize it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {presetThemes.map((theme) => (
                  <Card key={theme.name} className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-1">
                          <div className="h-10 w-10 rounded" style={{ backgroundColor: theme.primary }} />
                          <div className="h-10 w-10 rounded" style={{ backgroundColor: theme.secondary }} />
                        </div>
                        <h3 className="font-semibold">{theme.name}</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => {
                          setPrimaryColor(theme.primary)
                          setSecondaryColor(theme.secondary)
                        }}
                      >
                        Apply Theme
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save Theme Settings</Button>
      </div>
    </div>
  )
}
