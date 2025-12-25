"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Save,
  AlertCircle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

interface MenuItem {
  id: string
  label: string
  type: "internal" | "external" | "dropdown"
  link?: string
  enabled: boolean
  children?: MenuItem[]
  expanded?: boolean
}

export function MenuBuilder({ menuId }: { menuId: string }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      label: "Home",
      type: "internal",
      link: "/",
      enabled: true,
    },
    {
      id: "2",
      label: "Products",
      type: "dropdown",
      enabled: true,
      expanded: true,
      children: [
        {
          id: "2-1",
          label: "SaaS Solutions",
          type: "internal",
          link: "/products/saas",
          enabled: true,
        },
        {
          id: "2-2",
          label: "Enterprise",
          type: "internal",
          link: "/products/enterprise",
          enabled: true,
        },
      ],
    },
    {
      id: "3",
      label: "About",
      type: "internal",
      link: "/about",
      enabled: true,
    },
    {
      id: "4",
      label: "Blog",
      type: "external",
      link: "https://blog.example.com",
      enabled: true,
    },
  ])

  const selectedMenuItem = selectedItem ? findMenuItem(menuItems, selectedItem) : null

  function findMenuItem(items: MenuItem[], id: string): MenuItem | null {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = findMenuItem(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  const toggleExpanded = (id: string) => {
    const toggleInItems = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: toggleInItems(item.children) }
        }
        return item
      })
    }
    setMenuItems(toggleInItems(menuItems))
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updateInItems = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates }
        }
        if (item.children) {
          return { ...item, children: updateInItems(item.children) }
        }
        return item
      })
    }
    setMenuItems(updateInItems(menuItems))
  }

  const addChildItem = (parentId: string) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      label: "New Item",
      type: "internal",
      link: "/",
      enabled: true,
    }

    const addToItems = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            type: "dropdown" as const,
            children: [...(item.children || []), newItem],
            expanded: true,
          }
        }
        if (item.children) {
          return { ...item, children: addToItems(item.children) }
        }
        return item
      })
    }
    setMenuItems(addToItems(menuItems))
    setSelectedItem(newItem.id)
  }

  const deleteMenuItem = (id: string) => {
    const deleteFromItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.children) {
            return { ...item, children: deleteFromItems(item.children) }
          }
          return item
        })
    }
    setMenuItems(deleteFromItems(menuItems))
    setSelectedItem(null)
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => (
    <div key={item.id} className="space-y-1">
      <div
        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
          selectedItem === item.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
        }`}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        onClick={() => setSelectedItem(item.id)}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

        {item.type === "dropdown" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleExpanded(item.id)
            }}
            className="p-0.5 hover:bg-background rounded"
          >
            {item.expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        )}

        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{item.label}</span>
          {item.type === "dropdown" && (
            <Badge variant="secondary" className="text-xs">
              Dropdown
            </Badge>
          )}
          {item.type === "external" && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
        </div>

        {item.type === "dropdown" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              addChildItem(item.id)
            }}
            className="p-1 hover:bg-background rounded"
            title="Add child item"
          >
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            updateMenuItem(item.id, { enabled: !item.enabled })
          }}
        >
          {item.enabled ? (
            <Eye className="h-4 w-4 text-muted-foreground" />
          ) : (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {item.expanded && item.children && <div>{item.children.map((child) => renderMenuItem(child, depth + 1))}</div>}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Main Navigation</h1>
          <p className="text-pretty text-muted-foreground mt-1">Used in: Header (Desktop + Mobile)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Discard Changes</Button>
          <Button variant="outline">Preview</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Global content - Changes affect entire site</p>
              <p className="text-sm text-muted-foreground mt-1">
                This menu appears on all pages. Changes will be published after review.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Menu Tree */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Menu Structure</CardTitle>
                <CardDescription>Drag to reorder items</CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newItem: MenuItem = {
                    id: `item-${Date.now()}`,
                    label: "New Menu Item",
                    type: "internal",
                    link: "/",
                    enabled: true,
                  }
                  setMenuItems([...menuItems, newItem])
                  setSelectedItem(newItem.id)
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-150 pr-4">
              <div className="space-y-1">{menuItems.map((item) => renderMenuItem(item))}</div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Panel - Item Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{selectedMenuItem ? `Edit: ${selectedMenuItem.label}` : "Item Details"}</CardTitle>
            <CardDescription>
              {selectedMenuItem ? "Configure menu item settings" : "Select an item to edit"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedMenuItem ? (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      value={selectedMenuItem.label}
                      onChange={(e) => updateMenuItem(selectedMenuItem.id, { label: e.target.value })}
                      placeholder="Menu item label"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Link Type</Label>
                    <RadioGroup
                      value={selectedMenuItem.type}
                      onValueChange={(value: "internal" | "external" | "dropdown") =>
                        updateMenuItem(selectedMenuItem.id, { type: value })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="internal" id="internal" />
                        <Label htmlFor="internal" className="font-normal cursor-pointer">
                          Internal Page
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="external" id="external" />
                        <Label htmlFor="external" className="font-normal cursor-pointer">
                          External URL
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dropdown" id="dropdown" />
                        <Label htmlFor="dropdown" className="font-normal cursor-pointer">
                          Dropdown Menu
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {selectedMenuItem.type === "internal" && (
                    <div className="space-y-2">
                      <Label>Select Page</Label>
                      <div className="border rounded-md p-3 space-y-2">
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search pages..." className="pl-10" />
                        </div>
                        <ScrollArea className="h-50">
                          <div className="space-y-1">
                            {[
                              { title: "Homepage", path: "/" },
                              { title: "About Us", path: "/about" },
                              { title: "Products", path: "/products" },
                              { title: "Contact", path: "/contact" },
                            ].map((page) => (
                              <button
                                key={page.path}
                                className="w-full text-left p-2 rounded-md hover:bg-muted text-sm flex items-center gap-2"
                                onClick={() => updateMenuItem(selectedMenuItem.id, { link: page.path })}
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span>{page.title}</span>
                                <span className="text-muted-foreground ml-auto text-xs">{page.path}</span>
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      {selectedMenuItem.link && (
                        <p className="text-xs text-muted-foreground">Selected: {selectedMenuItem.link}</p>
                      )}
                    </div>
                  )}

                  {selectedMenuItem.type === "external" && (
                    <div className="space-y-2">
                      <Label htmlFor="url">External URL</Label>
                      <Input
                        id="url"
                        value={selectedMenuItem.link || ""}
                        onChange={(e) => updateMenuItem(selectedMenuItem.id, { link: e.target.value })}
                        placeholder="https://example.com"
                      />
                      <p className="text-xs text-muted-foreground">External links open in a new tab</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="settings" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enabled</Label>
                      <p className="text-xs text-muted-foreground">Show this item in the menu</p>
                    </div>
                    <Switch
                      checked={selectedMenuItem.enabled}
                      onCheckedChange={(checked) => updateMenuItem(selectedMenuItem.id, { enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Open in New Tab</Label>
                      <p className="text-xs text-muted-foreground">For external links</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => deleteMenuItem(selectedMenuItem.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Item
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-100 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Select a menu item to edit</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
