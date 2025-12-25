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
  ImageIcon,
  Mail,
  AlertCircle,
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

interface FooterBlock {
  id: string
  type: "text" | "menu" | "logo" | "social" | "newsletter"
  title?: string
  content?: any
}

export function FooterBuilder() {
  const [blocks, setBlocks] = useState<FooterBlock[]>([
    { id: "1", type: "logo", title: "Brand", content: { text: "Building the future" } },
    { id: "2", type: "menu", title: "Quick Links", content: { menuId: "footer-links" } },
    { id: "3", type: "menu", title: "Products", content: { menuId: "products" } },
    { id: "4", type: "newsletter", title: "Newsletter", content: {} },
  ])

  const [layout, setLayout] = useState<"4-column" | "3-column" | "custom">("4-column")

  const blockTypes = [
    { type: "text", label: "Text Block", icon: Type },
    { type: "menu", label: "Menu", icon: Menu },
    { type: "logo", label: "Logo", icon: ImageIcon },
    { type: "newsletter", label: "Newsletter", icon: Mail },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Footer Builder</h1>
          <p className="text-pretty text-muted-foreground mt-1">Design your site footer with flexible blocks</p>
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

      {/* Warning */}
      <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Global footer - Appears on all pages</p>
              <p className="text-sm text-muted-foreground mt-1">Changes will apply site-wide after publishing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Selection */}
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
                <Label
                  htmlFor="4-col"
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                >
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
                <Label
                  htmlFor="3-col"
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                >
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
                <Label
                  htmlFor="custom"
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                >
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

      {/* Block Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Footer Blocks</CardTitle>
              <CardDescription>Add and arrange content blocks</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
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
          <div className="grid grid-cols-4 gap-4">
            {blocks.map((block) => (
              <Card key={block.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div>
                        <CardTitle className="text-sm">{block.title}</CardTitle>
                        <CardDescription className="text-xs capitalize">{block.type} block</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-24 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                    Preview
                  </div>
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Bar */}
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
    </div>
  )
}
