"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Save,
  GripVertical,
  Settings,
  Menu,
  Type,
  Image,
  Mail,
  Trash2,
  Edit,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

// Data Models
interface MenuLink {
  id: string
  label: string
  slug: string
}

interface LogoBlockData {
  imageUrl: string
  altText: string
  text?: string
  link?: string
}

interface MenuBlockData {
  title: string
  links: MenuLink[]
}

interface TextBlockData {
  title?: string
  content: string
}

interface NewsletterBlockData {
  title: string
  description: string
  buttonText: string
  buttonAction: "subscribe" | "redirect"
  redirectUrl?: string
}

type BlockData = LogoBlockData | MenuBlockData | TextBlockData | NewsletterBlockData

interface FooterBlock {
  id: string
  type: "logo" | "menu" | "text" | "newsletter"
  data: BlockData
}

interface Footer {
  tenantId: string
  websiteId: string
  layout: "4-column" | "3-column" | "custom"
  blocks: FooterBlock[]
}

export default function FooterBuilder() {
  const [blocks, setBlocks] = useState<FooterBlock[]>([])
  const [layout, setLayout] = useState<"4-column" | "3-column" | "custom">("4-column")
  const [editOpen, setEditOpen] = useState(false)
  const [activeBlock, setActiveBlock] = useState<FooterBlock | null>(null)
  const [tenantId, setTenantId] = useState("")
  const [websiteId, setWebsiteId] = useState("")

  const blockTypes = [
    { type: "text", label: "Text Block", icon: Type },
    { type: "menu", label: "Menu", icon: Menu },
    { type: "logo", label: "Logo", icon: Image },
    { type: "newsletter", label: "Newsletter", icon: Mail },
  ]

  function createEmptyBlock(type: FooterBlock["type"]): FooterBlock {
    const base = {
      id: crypto.randomUUID(),
      type,
      data: {} as BlockData
    }

    switch (type) {
      case "logo":
        base.data = {
          imageUrl: "",
          altText: "",
          text: "",
          link: ""
        }
        break
      case "menu":
        base.data = {
          title: "",
          links: []
        }
        break
      case "text":
        base.data = {
          title: "",
          content: ""
        }
        break
      case "newsletter":
        base.data = {
          title: "",
          description: "",
          buttonText: "Subscribe",
          buttonAction: "subscribe"
        }
        break
    }

    return base
  }

  function addBlock(type: FooterBlock["type"]) {
    const newBlock = createEmptyBlock(type)
    setBlocks((prev) => [...prev, newBlock])
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  function saveEdit() {
    if (!activeBlock) return
    setBlocks((prev) =>
      prev.map((b) => (b.id === activeBlock.id ? activeBlock : b))
    )
    setEditOpen(false)
  }

  function updateBlockData(field: string, value: any) {
    if (!activeBlock) return
    setActiveBlock({
      ...activeBlock,
      data: {
        ...activeBlock.data,
        [field]: value
      }
    })
  }

  function addMenuLink() {
    if (!activeBlock || activeBlock.type !== "menu") return
    const menuData = activeBlock.data as MenuBlockData
    const newLink: MenuLink = {
      id: crypto.randomUUID(),
      label: "",
      slug: ""
    }
    setActiveBlock({
      ...activeBlock,
      data: {
        ...menuData,
        links: [...menuData.links, newLink]
      }
    })
  }

  function updateMenuLink(linkId: string, field: "label" | "slug", value: string) {
    if (!activeBlock || activeBlock.type !== "menu") return
    const menuData = activeBlock.data as MenuBlockData
    setActiveBlock({
      ...activeBlock,
      data: {
        ...menuData,
        links: menuData.links.map(link =>
          link.id === linkId ? { ...link, [field]: value } : link
        )
      }
    })
  }

  function deleteMenuLink(linkId: string) {
    if (!activeBlock || activeBlock.type !== "menu") return
    const menuData = activeBlock.data as MenuBlockData
    setActiveBlock({
      ...activeBlock,
      data: {
        ...menuData,
        links: menuData.links.filter(link => link.id !== linkId)
      }
    })
  }

  function getBlockTitle(block: FooterBlock): string {
    switch (block.type) {
      case "logo":
        const logoData = block.data as LogoBlockData
        return logoData.text || logoData.altText || "Logo Block"
      case "menu":
        const menuData = block.data as MenuBlockData
        return menuData.title || "Menu Block"
      case "text":
        const textData = block.data as TextBlockData
        return textData.title || "Text Block"
      case "newsletter":
        const newsletterData = block.data as NewsletterBlockData
        return newsletterData.title || "Newsletter Block"
      default:
        return "Untitled Block"
    }
  }

  function getBlockDescription(block: FooterBlock): string {
    switch (block.type) {
      case "logo":
        return "Logo"
      case "menu":
        const menuData = block.data as MenuBlockData
        return `${menuData.links.length} link${menuData.links.length !== 1 ? 's' : ''}`
      case "text":
        const textData = block.data as TextBlockData
        return textData.content.substring(0, 20) + (textData.content.length > 20 ? '...' : '')
      case "newsletter":
        const newsletterData = block.data as NewsletterBlockData
        return newsletterData.description.substring(0, 30) + (newsletterData.description.length > 30 ? '...' : '')
      default:
        return ""
    }
  }

  const gridCols =
    layout === "3-column"
      ? "grid-cols-3"
      : layout === "custom"
        ? "grid-cols-2"
        : "grid-cols-4"

  const visibleBlocks = blocks // No slicing - show all blocks

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Footer Builder</h1>
          <p className="text-pretty text-muted-foreground mt-1">
            Design your site footer with flexible blocks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Discard Changes</Button>
          <Button variant="outline">Preview</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Footer Settings</CardTitle>
          <CardDescription>
            Create or edit footer for a specific website
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tenantId">Tenant</Label>
            <select
              id="tenantId"
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            >
              <option value="">Select Tenant</option>
              <option value="tenant-1">Tenant One</option>
              <option value="tenant-2">Tenant Two</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <select
              id="website"
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={websiteId}
              onChange={(e) => setWebsiteId(e.target.value)}
            >
              <option value="">Select Website</option>
              <option value="site-1">example.com</option>
              <option value="site-2">shop.example.com</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
          <CardDescription>Choose your footer column structure</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={layout} onValueChange={(v) => setLayout(v as any)}>
            <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <RadioGroupItem value="4-column" id="4-col" className="peer sr-only" />
                <Label htmlFor="4-col" className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer">
                  <div className="flex gap-1 w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-1 h-16 bg-muted rounded" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4 Columns</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="3-column" id="3-col" className="peer sr-only" />
                <Label htmlFor="3-col" className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer">
                  <div className="flex gap-1 w-full">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-16 bg-muted rounded" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">3 Columns</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
                <Label htmlFor="custom" className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer">
                  <div className="flex gap-1 w-full">
                    <div className="w-1/3 h-16 bg-muted rounded" />
                    <div className="flex-1 h-16 bg-muted rounded" />
                  </div>
                  <span className="text-sm font-medium">Custom</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Footer Blocks</CardTitle>
              <CardDescription>Add and arrange content blocks</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button  size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Block
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Footer Block</DialogTitle>
                  <DialogDescription>Choose a block type to add</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {blockTypes.map((blockType) => (
                    <button
                      key={blockType.type}
                      onClick={() => addBlock(blockType.type as FooterBlock["type"])}
                      className="flex flex-col items-center gap-3 p-4 border-2 rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                      <blockType.icon className="h-8 w-8" />
                      <span className="font-medium">{blockType.label}</span>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className={`grid ${gridCols} gap-4`}>
            {visibleBlocks.map((block) => (
              <Card key={block.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div>
                        <CardTitle className="text-sm">{getBlockTitle(block) || "(Untitled)"}</CardTitle>
                        <CardDescription className="text-xs capitalize">
                          {block.type === "logo" && "Logo"}
                          {block.type === "menu" &&
                            `${(block.data as MenuBlockData).links.length} link${(block.data as MenuBlockData).links.length !== 1 ? 's' : ''}`}
                          {block.type === "text" && "Text"}
                          {block.type === "newsletter" && "Newsletter"}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="h-24 bg-muted rounded p-2 overflow-hidden text-xs">
                    {block.type === "menu" && (
                      <div className="h-full flex flex-col">
                        <div className="font-medium text-foreground mb-1 truncate">
                          {(block.data as MenuBlockData).title || "Menu Title"}
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-0.5">
                          {(block.data as MenuBlockData).links.length > 0 ? (
                            (block.data as MenuBlockData).links.map((link) => (
                              <div key={link.id} className="text-muted-foreground hover:text-foreground truncate">
                                → {link.label || "Link"}
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground italic">No links added</div>
                          )}
                        </div>
                      </div>
                    )}

                    {block.type === "logo" && (
                      <div className="h-full flex flex-col items-center justify-center">
                        <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center mb-1">
                          <Image className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-center truncate max-w-full">
                          {(block.data as LogoBlockData).text || "Logo"}
                        </div>
                      </div>
                    )}

                    {block.type === "text" && (
                      <div className="h-full overflow-hidden">
                        {(block.data as TextBlockData).title && (
                          <div className="font-medium text-foreground mb-1 truncate">
                            {(block.data as TextBlockData).title}
                          </div>
                        )}
                        <div className="text-muted-foreground text-[10px] leading-tight line-clamp-3">
                          {(block.data as TextBlockData).content || "No content"}
                        </div>
                      </div>
                    )}

                    {block.type === "newsletter" && (
                      <div className="h-full flex flex-col">
                        <div className="font-medium text-foreground mb-1 truncate">
                          {(block.data as NewsletterBlockData).title || "Newsletter"}
                        </div>
                        <div className="text-[10px] text-muted-foreground mb-1 line-clamp-2 flex-1">
                          {(block.data as NewsletterBlockData).description || "Stay updated"}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 h-5 bg-background border rounded px-2 flex items-center text-[10px]">
                            email@example.com
                          </div>
                          <div className="h-5 px-2 bg-primary text-primary-foreground rounded text-[10px] flex items-center">
                            {(block.data as NewsletterBlockData).buttonText || "Subscribe"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setActiveBlock(block)
                        setEditOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteBlock(block.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bottom Bar</CardTitle>
          <CardDescription>Copyright text and social links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input id="copyright" placeholder="© 2025 Your Company" />
            </div>
            <div className="space-y-2">
              <Label>Social Links</Label>
              <Button variant="outline" className="w-full bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Manage Social Links
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Block: {activeBlock?.type}</DialogTitle>
          </DialogHeader>
          {activeBlock && (
            <div className="space-y-4">
              {activeBlock.type === "logo" && (
                <>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={(activeBlock.data as LogoBlockData).imageUrl || ""}
                      onChange={(e) => updateBlockData("imageUrl", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alt Text</Label>
                    <Input
                      value={(activeBlock.data as LogoBlockData).altText || ""}
                      onChange={(e) => updateBlockData("altText", e.target.value)}
                      placeholder="Company Logo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Optional Text</Label>
                    <Input
                      value={(activeBlock.data as LogoBlockData).text || ""}
                      onChange={(e) => updateBlockData("text", e.target.value)}
                      placeholder="Company name or tagline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Optional Link</Label>
                    <Input
                      value={(activeBlock.data as LogoBlockData).link || ""}
                      onChange={(e) => updateBlockData("link", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </>
              )}

              {activeBlock.type === "menu" && (
                <>
                  <div className="space-y-2">
                    <Label>Menu Title</Label>
                    <Input
                      value={(activeBlock.data as MenuBlockData).title || ""}
                      onChange={(e) => updateBlockData("title", e.target.value)}
                      placeholder="e.g. Quick Links"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Menu Links</Label>
                      <Button size="sm" variant="outline" onClick={addMenuLink}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Link
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {(activeBlock.data as MenuBlockData).links.map((link) => (
                        <div key={link.id} className="flex gap-2 items-start p-3 border rounded-lg">
                          <div className="flex-1 space-y-2">
                            <Input
                              value={link.label}
                              onChange={(e) => updateMenuLink(link.id, "label", e.target.value)}
                              placeholder="Link Label"
                            />
                            <Input
                              value={link.slug}
                              onChange={(e) => updateMenuLink(link.id, "slug", e.target.value)}
                              placeholder="Slug (e.g. /about)"
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMenuLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeBlock.type === "text" && (
                <>
                  <div className="space-y-2">
                    <Label>Optional Title</Label>
                    <Input
                      value={(activeBlock.data as TextBlockData).title || ""}
                      onChange={(e) => updateBlockData("title", e.target.value)}
                      placeholder="Section title (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={(activeBlock.data as TextBlockData).content || ""}
                      onChange={(e) => updateBlockData("content", e.target.value)}
                      placeholder="Enter your text content here..."
                      rows={5}
                    />
                  </div>
                </>
              )}

              {activeBlock.type === "newsletter" && (
                <>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={(activeBlock.data as NewsletterBlockData).title || ""}
                      onChange={(e) => updateBlockData("title", e.target.value)}
                      placeholder="Subscribe to our newsletter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={(activeBlock.data as NewsletterBlockData).description || ""}
                      onChange={(e) => updateBlockData("description", e.target.value)}
                      placeholder="Enter newsletter description..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={(activeBlock.data as NewsletterBlockData).buttonText || ""}
                      onChange={(e) => updateBlockData("buttonText", e.target.value)}
                      placeholder="Subscribe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Action</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      value={(activeBlock.data as NewsletterBlockData).buttonAction}
                      onChange={(e) => updateBlockData("buttonAction", e.target.value)}
                    >
                      <option value="subscribe">Subscribe Action</option>
                      <option value="redirect">Redirect to URL</option>
                    </select>
                  </div>
                  {(activeBlock.data as NewsletterBlockData).buttonAction === "redirect" && (
                    <div className="space-y-2">
                      <Label>Redirect URL</Label>
                      <Input
                        value={(activeBlock.data as NewsletterBlockData).redirectUrl || ""}
                        onChange={(e) => updateBlockData("redirectUrl", e.target.value)}
                        placeholder="https://example.com/subscribe"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}