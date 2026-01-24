

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Palette, Type, LayoutIcon, Sparkles, Save, RotateCcw, CheckCircle, XCircle, AlertCircle, Globe, Server, Zap, Building, Monitor, Activity, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {createTheme} from "@/Api/Theme/create";
import UnderConstruction404  from "@/notNow/UnderConstruction404";

const loadThemeSetting = async (websiteId: string) => {
  try {
    const response = await fetch(`/api/websites/${websiteId}/theme`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()

      // ENFORCE GLOBAL THEME SCOPE
      // Reject or ignore page-level data
      if (data.theme?.metadata?.scope !== "global") {
        console.warn('Rejecting non-global theme data. Scope must be "global"')
        return null
      }

      return data
    } else {
      throw new Error('Failed to load theme from backend')
    }
  } catch (error) {
    console.warn('Backend unavailable, using mock data:', error)
    // Fall through to mock data
    return null
  }
}

/**
 * Create or update theme settings
 * @param payload - Complete theme payload
 * @returns Promise with response data
 */
const createThemeSetting = async (payload: any) => {
  try {
    const response = await createTheme(payload);

    if (!response?.ok) {
      throw new Error('Failed to save theme')
    }

    return response
  } catch (error) {
    console.error('Error saving theme:', error)
    throw error
  }
}

// ==================== TENANT-AWARE MOCK DATA ====================
/**
 * Generate mock theme data based on website ID with tenant context
 * Demonstrates comprehensive multi-tenant global website theming
 */
const getMockThemeByWebsiteId = (websiteId: string) => {
  const now = new Date().toISOString()

  // Tenant-aware theme definitions
  const tenantThemes: Record<string, Record<string, any>> = {
    // Tenant A: Corporate clients
    "tenant-a": {
      "yellow-site": {
        name: "Sunshine Corp",
        colors: {
          primary: "#f59e0b", // Yellow
          secondary: "#d97706", // Darker yellow
        },
        typography: {
          headingFont: "Poppins",
          bodyFont: "Open Sans",
        },
        layout: {
          containerWidth: "full",
          borderRadius: "large",
          sectionSpacing: "relaxed",
          headerStyle: "sticky",
        },
        metadata: {
          scope: "global",
          version: 2,
          lastUpdated: now,
        }
      },
      "green-site": {
        name: "Eco Solutions Inc",
        colors: {
          primary: "#10b981", // Green
          secondary: "#059669", // Darker green
        },
        typography: {
          headingFont: "Montserrat",
          bodyFont: "Lato",
        },
        layout: {
          containerWidth: "1280",
          borderRadius: "small",
          sectionSpacing: "compact",
          headerStyle: "fixed",
        },
        metadata: {
          scope: "global",
          version: 1,
          lastUpdated: now,
        }
      },
      "corporate-site": {
        name: "Enterprise Portal",
        colors: {
          primary: "#6b7280", // Gray
          secondary: "#4b5563", // Darker gray
        },
        typography: {
          headingFont: "Roboto",
          bodyFont: "Roboto",
        },
        layout: {
          containerWidth: "1024",
          borderRadius: "none",
          sectionSpacing: "compact",
          headerStyle: "static",
        },
        metadata: {
          scope: "global",
          version: 1,
          lastUpdated: now,
        }
      }
    },

    // Tenant B: Creative agencies
    "tenant-b": {
      "blue-site": {
        name: "Ocean Creative",
        colors: {
          primary: "#3b82f6", // Blue
          secondary: "#1d4ed8", // Darker blue
        },
        typography: {
          headingFont: "Playfair Display",
          bodyFont: "Merriweather",
        },
        layout: {
          containerWidth: "1536",
          borderRadius: "medium",
          sectionSpacing: "normal",
          headerStyle: "static",
        },
        metadata: {
          scope: "global",
          version: 3,
          lastUpdated: now,
        }
      },
      "red-site": {
        name: "Bold Agency",
        colors: {
          primary: "#ef4444", // Red
          secondary: "#dc2626", // Darker red
        },
        typography: {
          headingFont: "Montserrat",
          bodyFont: "Inter",
        },
        layout: {
          containerWidth: "full",
          borderRadius: "large",
          sectionSpacing: "relaxed",
          headerStyle: "sticky",
        },
        metadata: {
          scope: "global",
          version: 1,
          lastUpdated: now,
        }
      },
      "purple-site": {
        name: "Innovation Studio",
        colors: {
          primary: "#8b5cf6", // Purple
          secondary: "#7c3aed", // Darker purple
        },
        typography: {
          headingFont: "Inter",
          bodyFont: "Inter",
        },
        layout: {
          containerWidth: "1536",
          borderRadius: "medium",
          sectionSpacing: "normal",
          headerStyle: "fixed",
        },
        metadata: {
          scope: "global",
          version: 2,
          lastUpdated: now,
        }
      }
    },

    // Tenant C: E-commerce businesses
    "tenant-c": {
      "shop-site": {
        name: "Premium Store",
        colors: {
          primary: "#f97316", // Orange
          secondary: "#ea580c", // Darker orange
        },
        typography: {
          headingFont: "Poppins",
          bodyFont: "Open Sans",
        },
        layout: {
          containerWidth: "full",
          borderRadius: "medium",
          sectionSpacing: "compact",
          headerStyle: "sticky",
        },
        metadata: {
          scope: "global",
          version: 1,
          lastUpdated: now,
        }
      },
      "market-site": {
        name: "Marketplace Hub",
        colors: {
          primary: "#84cc16", // Lime
          secondary: "#65a30d", // Darker lime
        },
        typography: {
          headingFont: "Lato",
          bodyFont: "Roboto",
        },
        layout: {
          containerWidth: "1280",
          borderRadius: "small",
          sectionSpacing: "normal",
          headerStyle: "fixed",
        },
        metadata: {
          scope: "global",
          version: 1,
          lastUpdated: now,
        }
      }
    }
  }

  // Find which tenant owns this website
  for (const [tenantId, websites] of Object.entries(tenantThemes)) {
    if (websites[websiteId]) {
      return {
        theme: websites[websiteId]
      }
    }
  }

  // Return default theme for unknown websites
  return {
    theme: {
      name: "Global Theme",
      colors: {
        primary: "#8b5cf6",
        secondary: "#10b981",
      },
      typography: {
        headingFont: "Inter",
        bodyFont: "Inter",
      },
      layout: {
        containerWidth: "1280",
        borderRadius: "medium",
        sectionSpacing: "normal",
        headerStyle: "fixed",
      },
      metadata: {
        scope: "global",
        version: 1,
        lastUpdated: now,
      }
    }
  }
}

// Mock tenant and website data
const MOCK_TENANTS = [
  { id: "tenant-a", name: "Enterprise Corp", status: "active" },
  { id: "tenant-b", name: "Creative Agency Group", status: "active" },
  { id: "tenant-c", name: "E-commerce Network", status: "active" },
  { id: "tenant-d", name: "Startup Hub", status: "draft" },
]

const MOCK_WEBSITES = [
  // Tenant A websites
  { id: "yellow-site", name: "Sunshine Corp", domain: "sunshine.example.com", tenantId: "tenant-a", status: "active" },
  { id: "green-site", name: "Eco Solutions Inc", domain: "eco.example.com", tenantId: "tenant-a", status: "active" },
  { id: "corporate-site", name: "Enterprise Portal", domain: "portal.example.com", tenantId: "tenant-a", status: "draft" },

  // Tenant B websites
  { id: "blue-site", name: "Ocean Creative", domain: "ocean.example.com", tenantId: "tenant-b", status: "active" },
  { id: "red-site", name: "Bold Agency", domain: "bold.example.com", tenantId: "tenant-b", status: "active" },
  { id: "purple-site", name: "Innovation Studio", domain: "innovation.example.com", tenantId: "tenant-b", status: "active" },

  // Tenant C websites
  { id: "shop-site", name: "Premium Store", domain: "premium.example.com", tenantId: "tenant-c", status: "active" },
  { id: "market-site", name: "Marketplace Hub", domain: "market.example.com", tenantId: "tenant-c", status: "draft" },

  // Default fallback
  { id: "default-website-id", name: "Default Website", domain: "default.example.com", tenantId: "tenant-a", status: "active" },
]

const DEFAULT_THEME_NAME = "Global Theme"
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_THEME_DATA === "true" || false

//remove later
export default function ThemePage() {
  const isUpdating = true;
  
  if(isUpdating){
    return <UnderConstruction404 />
  }
  // ==================== EXISTING STATE VARIABLES (DO NOT RENAME) ====================
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6")
  const [secondaryColor, setSecondaryColor] = useState("#10b981")
  const [fontHeading, setFontHeading] = useState("Inter")
  const [fontBody, setFontBody] = useState("Inter")

  // ==================== NEW STATE VARIABLES ====================
  // Layout state (from existing UI controls)
  const [containerWidth, setContainerWidth] = useState("1280")
  const [borderRadius, setBorderRadius] = useState("medium")
  const [sectionSpacing, setSectionSpacing] = useState("normal")
  const [headerStyle, setHeaderStyle] = useState("fixed")

  // Theme metadata
  const [themeName, setThemeName] = useState(DEFAULT_THEME_NAME)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const [themeVersion, setThemeVersion] = useState(1)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<any>(null)
  const [environmentMode, setEnvironmentMode] = useState<"live" | "mock">("live")

  // ==================== MULTI-TENANT STATE VARIABLES ====================
  const [selectedTenantId, setSelectedTenantId] = useState<string>("tenant-a")
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("yellow-site")
  const [selectedWebsite, setSelectedWebsite] = useState<any>(MOCK_WEBSITES.find(w => w.id === "yellow-site"))
  const [availableWebsites, setAvailableWebsites] = useState(MOCK_WEBSITES.filter(w => w.tenantId === "tenant-a"))

  // ==================== STRUCTURED THEME PAYLOAD ====================
  const themePayload = useRef({
    websiteId: selectedWebsiteId,
    website: {
      id: selectedWebsite?.id || "",
      name: selectedWebsite?.name || "",
      domain: selectedWebsite?.domain || "",
      status: selectedWebsite?.status || "active",
      tenantId: selectedTenantId,
    },
    theme: {
      name: themeName,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
      },
      typography: {
        headingFont: fontHeading,
        bodyFont: fontBody,
      },
      layout: {
        containerWidth,
        borderRadius,
        sectionSpacing,
        headerStyle,
      },
      metadata: {
        scope: "global", // ENFORCED: Always global scope
        version: themeVersion,
        lastUpdated: lastUpdatedAt,
      }
    }
  })

  // Update payload when state changes
  useEffect(() => {
    themePayload.current = {
      websiteId: selectedWebsiteId,
      website: {
        id: selectedWebsite?.id || "",
        name: selectedWebsite?.name || "",
        domain: selectedWebsite?.domain || "",
        status: selectedWebsite?.status || "active",
        tenantId: selectedTenantId,
      },
      theme: {
        name: themeName,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
        },
        typography: {
          headingFont: fontHeading,
          bodyFont: fontBody,
        },
        layout: {
          containerWidth,
          borderRadius,
          sectionSpacing,
          headerStyle,
        },
        metadata: {
          scope: "global", // ENFORCED: Always global scope
          version: themeVersion,
          lastUpdated: lastUpdatedAt,
        }
      }
    }
  }, [primaryColor, secondaryColor, fontHeading, fontBody, containerWidth, borderRadius, sectionSpacing, headerStyle, themeName, themeVersion, lastUpdatedAt, selectedWebsiteId, selectedWebsite, selectedTenantId])

  // ==================== LIVE PREVIEW VIA CSS VARIABLES ====================
  const applyCSSVariables = useCallback((theme: any) => {
    if (typeof document === 'undefined' || !theme) return

    const root = document.documentElement

    // Set CSS variables for live preview
    if (theme.colors?.primary) {
      root.style.setProperty('--theme-primary', theme.colors.primary)
    }
    if (theme.colors?.secondary) {
      root.style.setProperty('--theme-secondary', theme.colors.secondary)
    }
    if (theme.typography?.headingFont) {
      root.style.setProperty('--theme-font-heading', theme.typography.headingFont)
    }
    if (theme.typography?.bodyFont) {
      root.style.setProperty('--theme-font-body', theme.typography.bodyFont)
    }

    // Set layout variables
    if (theme.layout?.containerWidth) {
      root.style.setProperty('--theme-container-width',
        theme.layout.containerWidth === 'full' ? '100%' : `${theme.layout.containerWidth}px`)
    }

    // Map border radius values to CSS
    if (theme.layout?.borderRadius) {
      const borderRadiusMap: Record<string, string> = {
        'none': '0',
        'small': '4px',
        'medium': '8px',
        'large': '16px'
      }
      root.style.setProperty('--theme-border-radius',
        borderRadiusMap[theme.layout.borderRadius] || '8px')
    }

    // Set spacing values
    if (theme.layout?.sectionSpacing) {
      const spacingMap: Record<string, string> = {
        'compact': '2rem',
        'normal': '3rem',
        'relaxed': '4rem'
      }
      root.style.setProperty('--theme-section-spacing',
        spacingMap[theme.layout.sectionSpacing] || '3rem')
    }
  }, [])

  const applyLivePreview = useCallback(() => {
    applyCSSVariables(themePayload.current.theme)
  }, [applyCSSVariables])

  // Apply live preview on state changes
  useEffect(() => {
    applyLivePreview()
  }, [applyLivePreview])

  // ==================== WEBSITE SELECTION HANDLERS ====================
  const handleTenantChange = useCallback((tenantId: string) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm(
        "You have unsaved theme changes. Changing tenant will discard these changes. Continue?"
      )
      if (!confirmChange) return
    }

    setSelectedTenantId(tenantId)

    // Filter websites for selected tenant
    const tenantWebsites = MOCK_WEBSITES.filter(w => w.tenantId === tenantId)
    setAvailableWebsites(tenantWebsites)

    // Auto-select first website in tenant if available
    if (tenantWebsites.length > 0) {
      const firstWebsite = tenantWebsites[0]
      setSelectedWebsiteId(firstWebsite.id)
      setSelectedWebsite(firstWebsite)

      // Reset unsaved changes state
      setHasUnsavedChanges(false)

      // Load theme for the new website
      setTimeout(() => loadThemeForWebsite(firstWebsite.id), 100)
    }
  }, [hasUnsavedChanges])

  const handleWebsiteChange = useCallback((websiteId: string) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm(
        "You have unsaved theme changes. Changing website will discard these changes. Continue?"
      )
      if (!confirmChange) return
    }

    const website = MOCK_WEBSITES.find(w => w.id === websiteId)
    if (!website) return

    setSelectedWebsiteId(websiteId)
    setSelectedWebsite(website)

    // Reset unsaved changes state
    setHasUnsavedChanges(false)

    // Load theme for the new website
    loadThemeForWebsite(websiteId)
  }, [hasUnsavedChanges])

  // ==================== BACKEND INTEGRATION ====================
  const loadThemeForWebsite = useCallback(async (websiteId: string) => {
    setIsLoading(true)

    try {
      // Use semantic backend function with selected website ID
      const data = await loadThemeSetting(websiteId)

      if (data?.theme) {
        // SUCCESS: Backend returned data
        setEnvironmentMode("live")

        // Hydrate state from backend data
        hydrateStateFromTheme(data.theme)

        // Save snapshot for reset functionality
        setLastSavedSnapshot(data.theme)

        // Apply CSS variables
        applyCSSVariables(data.theme)
      } else {
        // FALLBACK: Use mock data
        setEnvironmentMode("mock")
        console.log('Using mock theme data for website:', websiteId)

        const mockData = getMockThemeByWebsiteId(websiteId)

        // Hydrate state from mock data
        hydrateStateFromTheme(mockData.theme)

        // Save snapshot for reset functionality
        setLastSavedSnapshot(mockData.theme)

        // Apply CSS variables
        applyCSSVariables(mockData.theme)
      }
    } catch (error) {
      console.error('Error in theme loading process:', error)
      // Non-blocking - UI continues to work
      setEnvironmentMode("mock")

      // Use default mock data
      const mockData = getMockThemeByWebsiteId(websiteId)
      hydrateStateFromTheme(mockData.theme)
      setLastSavedSnapshot(mockData.theme)
      applyCSSVariables(mockData.theme)
    } finally {
      setIsLoading(false)
    }
  }, [applyCSSVariables])

  const saveThemeSettings = useCallback(async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // ENFORCE GLOBAL SCOPE before saving
      const payload = {
        ...themePayload.current,
        theme: {
          ...themePayload.current.theme,
          metadata: {
            ...themePayload.current.theme.metadata,
            scope: "global" // Force global scope
          }
        }
      }

      // Use semantic backend function
      await createThemeSetting(payload)

      setSaveStatus("saved")
      setHasUnsavedChanges(false)
      setLastSavedSnapshot(themePayload.current.theme)
      setLastUpdatedAt(new Date().toISOString())
      setEnvironmentMode("live") // Successfully saved to live backend

      toast.success("Theme saved successfully", {
        description: `Global website theme has been updated for ${selectedWebsite?.name}`,
      })

      // Reset status after 3 seconds
      setTimeout(() => {
        if (saveStatus === "saved") {
          setSaveStatus("idle")
        }
      }, 3000)
    } catch (error) {
      console.error('Error saving theme:', error)
      setSaveStatus("error")

      toast.error("Failed to save theme", {
        description: "Please check your connection and try again",
      })

      // Reset error status after 5 seconds
      setTimeout(() => {
        if (saveStatus === "error") {
          setSaveStatus("idle")
        }
      }, 5000)
    } finally {
      setIsSaving(false)
    }
  }, [saveStatus, selectedWebsite])

  // Helper function to hydrate state from theme data
  const hydrateStateFromTheme = useCallback((theme: any) => {
    setPrimaryColor(theme.colors?.primary || "#8b5cf6")
    setSecondaryColor(theme.colors?.secondary || "#10b981")
    setFontHeading(theme.typography?.headingFont || "Inter")
    setFontBody(theme.typography?.bodyFont || "Inter")
    setContainerWidth(theme.layout?.containerWidth || "1280")
    setBorderRadius(theme.layout?.borderRadius || "medium")
    setSectionSpacing(theme.layout?.sectionSpacing || "normal")
    setHeaderStyle(theme.layout?.headerStyle || "fixed")
    setThemeName(theme.name || DEFAULT_THEME_NAME)
    setThemeVersion(theme.metadata?.version || 1)
    setLastUpdatedAt(theme.metadata?.lastUpdated || null)
  }, [])

  // ==================== RESET LOGIC WITH CSS VARIABLES ====================
  const resetToSavedState = useCallback(() => {
    if (!lastSavedSnapshot) {
      toast.info("No saved state to reset to", {
        description: "Save your theme first or load from backend",
      })
      return
    }

    if (hasUnsavedChanges) {
      const confirmReset = window.confirm(
        "You have unsaved changes. Are you sure you want to reset to the last saved state?"
      )
      if (!confirmReset) return
    }

    // Reset state to last saved snapshot
    hydrateStateFromTheme(lastSavedSnapshot)

    // CRITICAL: Also re-apply CSS variables from saved snapshot
    applyCSSVariables(lastSavedSnapshot)

    setHasUnsavedChanges(false)

    toast.info("Theme reset to last saved state", {
      description: "CSS variables have been restored",
    })
  }, [lastSavedSnapshot, hasUnsavedChanges, hydrateStateFromTheme, applyCSSVariables])

  // ==================== PRESET THEMES ====================
  const presetThemes = [
    { name: "Default", primary: "#8b5cf6", secondary: "#10b981" },
    { name: "Ocean", primary: "#0ea5e9", secondary: "#06b6d4" },
    { name: "Forest", primary: "#10b981", secondary: "#84cc16" },
    { name: "Sunset", primary: "#f97316", secondary: "#f59e0b" },
    { name: "Rose", primary: "#f43f5e", secondary: "#ec4899" },
    { name: "Midnight", primary: "#6366f1", secondary: "#8b5cf6" },
  ]

  const applyPresetTheme = useCallback((preset: { primary: string; secondary: string; name: string }) => {
    setPrimaryColor(preset.primary)
    setSecondaryColor(preset.secondary)
    setThemeName(`Preset: ${preset.name}`)
    setHasUnsavedChanges(true)

    toast.info("Preset theme applied", {
      description: "Review changes before saving to global website theme",
    })
  }, [])

  // ==================== TRACK UNSAVED CHANGES ====================
  useEffect(() => {
    // Compare current state with last saved snapshot
    if (!lastSavedSnapshot) return

    const currentTheme = themePayload.current.theme
    const hasChanges =
      currentTheme.colors.primary !== lastSavedSnapshot.colors?.primary ||
      currentTheme.colors.secondary !== lastSavedSnapshot.colors?.secondary ||
      currentTheme.typography.headingFont !== lastSavedSnapshot.typography?.headingFont ||
      currentTheme.typography.bodyFont !== lastSavedSnapshot.typography?.bodyFont ||
      currentTheme.layout.containerWidth !== lastSavedSnapshot.layout?.containerWidth ||
      currentTheme.layout.borderRadius !== lastSavedSnapshot.layout?.borderRadius ||
      currentTheme.layout.sectionSpacing !== lastSavedSnapshot.layout?.sectionSpacing ||
      currentTheme.layout.headerStyle !== lastSavedSnapshot.layout?.headerStyle ||
      currentTheme.name !== lastSavedSnapshot.name

    setHasUnsavedChanges(hasChanges)
  }, [primaryColor, secondaryColor, fontHeading, fontBody, containerWidth, borderRadius, sectionSpacing, headerStyle, themeName, lastSavedSnapshot])

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    loadThemeForWebsite(selectedWebsiteId)
  }, [loadThemeForWebsite, selectedWebsiteId])

  const fonts = ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Playfair Display", "Merriweather"]

  return (
    <div className="space-y-6">
      {/* ==================== TENANT & WEBSITE SELECTOR ==================== */}
      <Card className="border-2 border-primary/10 bg-gradient-to-r from-primary/5 to-primary/2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">Multi-Tenant Theme Control</CardTitle>
            </div>
            <Badge variant="outline" className="bg-background/80">
              <Shield className="h-3 w-3 mr-1" />
              Global Scope Only
            </Badge>
          </div>
          <CardDescription>
            Select tenant and website to manage global theme settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenant-selector" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Tenant
              </Label>
              <Select
                value={selectedTenantId}
                onValueChange={handleTenantChange}
              >
                <SelectTrigger id="tenant-selector" className="h-11 bg-background">
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TENANTS.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id} className="h-11">
                      <div className="flex items-center justify-between w-full">
                        <span>{tenant.name}</span>
                        <Badge
                          variant={tenant.status === "active" ? "default" : "outline"}
                          className="ml-2 h-5 text-xs"
                        >
                          {tenant.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website-selector" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Page
              </Label>
              <Label htmlFor="website-selector" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
               Page - Note: This feature is under development and will be available in a future release.
              </Label>
              <Select
                value={selectedWebsiteId}
                onValueChange={handleWebsiteChange}
                disabled={availableWebsites.length === 0}
              >
                <SelectTrigger id="website-selector" className="h-11 bg-background">
                  <SelectValue placeholder="Select website" />
                </SelectTrigger>
                <SelectContent>
                  {availableWebsites.map((website) => (
                    <SelectItem key={website.id} value={website.id} className="h-11">
                      <div className="flex flex-col">
                        <span className="font-medium">{website.name}</span>
                        <span className="text-xs text-muted-foreground">{website.domain}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-start">
        <div>
          {/* GLOBAL WEBSITE THEME ENGINE DECLARATION */}
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              GLOBAL WEBSITE THEME ENGINE
            </span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight">Theme Customization</h1>
          <p className="text-pretty text-muted-foreground mt-1">
            Customize colors, fonts, and layout to match your brand
          </p>

          {/* Website Details */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {selectedWebsite && (
              <div className="flex items-center gap-1 text-sm bg-primary/10 px-3 py-1 rounded-full">
                <Monitor className="h-3 w-3" />
                <span className="font-medium">{selectedWebsite.name}</span>
                <span className="text-muted-foreground mx-1">•</span>
                <span className="text-xs">{selectedWebsite.domain}</span>
              </div>
            )}

            <Badge
              variant={environmentMode === "live" ? "default" : "outline"}
              className={environmentMode === "live"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
              }
            >
              {environmentMode === "live" ? (
                <>
                  <Zap className="h-3 w-3 mr-1" />
                  Live Backend
                </>
              ) : (
                <>
                  <Server className="h-3 w-3 mr-1" />
                  Mock Data
                </>
              )}
            </Badge>

            {selectedWebsite?.status && (
              <Badge
                variant={selectedWebsite.status === "active" ? "default" : "outline"}
                className={selectedWebsite.status === "active"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-yellow-50 text-yellow-800 border-yellow-200"
                }
              >
                <Activity className="h-3 w-3 mr-1" />
                {selectedWebsite.status}
              </Badge>
            )}

            {themeName !== DEFAULT_THEME_NAME && (
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                Theme: {themeName}
              </Badge>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}

          {saveStatus === "saving" && (
            <span className="text-sm text-muted-foreground flex items-center">
              <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full mr-2" />
              Saving...
            </span>
          )}

          {saveStatus === "saved" && (
            <span className="text-sm text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Saved
            </span>
          )}

          {saveStatus === "error" && (
            <span className="text-sm text-red-600 flex items-center">
              <XCircle className="h-3 w-3 mr-1" />
              Failed to save
            </span>
          )}

          {lastUpdatedAt && (
            <span className="text-xs text-muted-foreground">
              Updated: {new Date(lastUpdatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* ==================== IMPROVED TABS UI ==================== */}
      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="h-12 w-full bg-muted/50 p-1 rounded-lg border">
          <TabsTrigger value="colors" className="h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout" className="h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutIcon className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="presets" className="h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
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
                      onChange={(e) => {
                        setPrimaryColor(e.target.value)
                        setHasUnsavedChanges(true)
                      }}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value)
                        setHasUnsavedChanges(true)
                      }}
                      className="flex-1"
                    />
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
                      onChange={(e) => {
                        setSecondaryColor(e.target.value)
                        setHasUnsavedChanges(true)
                      }}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => {
                        setSecondaryColor(e.target.value)
                        setHasUnsavedChanges(true)
                      }}
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
                  <Select
                    value={fontHeading}
                    onValueChange={(value) => {
                      setFontHeading(value)
                      setHasUnsavedChanges(true)
                    }}
                  >
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
                  <Select
                    value={fontBody}
                    onValueChange={(value) => {
                      setFontBody(value)
                      setHasUnsavedChanges(true)
                    }}
                  >
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
                  <Select
                    value={containerWidth}
                    onValueChange={(value) => {
                      setContainerWidth(value)
                      setHasUnsavedChanges(true)
                    }}
                  >
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
                  <Select
                    value={borderRadius}
                    onValueChange={(value) => {
                      setBorderRadius(value)
                      setHasUnsavedChanges(true)
                    }}
                  >
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
                  <Select
                    value={sectionSpacing}
                    onValueChange={(value) => {
                      setSectionSpacing(value)
                      setHasUnsavedChanges(true)
                    }}
                  >
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
                  <Select
                    value={headerStyle}
                    onValueChange={(value) => {
                      setHeaderStyle(value)
                      setHasUnsavedChanges(true)
                    }}
                  >
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
                        onClick={() => applyPresetTheme(theme)}
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

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            <span>Theme scope: <span className="font-medium">Global Website</span></span>
            <span className="mx-2">•</span>
            <span>Version: <span className="font-medium">{themeVersion}</span></span>
            <span className="mx-2">•</span>
            <span>Tenant: <span className="font-medium">{selectedTenantId}</span></span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            This theme applies to the entire website. Page-level overrides are not supported.
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={resetToSavedState}
            disabled={!lastSavedSnapshot || (!hasUnsavedChanges && saveStatus !== "saving")}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Saved
          </Button>
          <Button
            onClick={saveThemeSettings}
            disabled={!hasUnsavedChanges || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Theme Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}