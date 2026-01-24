"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, Layout, Type, ImageIcon, Grid3x3, Megaphone, Mail, Users, Star } from "lucide-react"
import { useState } from "react"

interface BlockLibraryProps {
  onClose: () => void
  onSelectBlock: (blockType: string) => void
}

const blockTypes = [
  {
    type: "hero",
    name: "Hero Section",
    description: "Large banner with headline and CTA",
    icon: Layout,
    category: "Headers",
  },
  {
    type: "text",
    name: "Text Block",
    description: "Rich text content section",
    icon: Type,
    category: "Content",
  },
  {
    type: "features",
    name: "Features Grid",
    description: "Showcase features in a grid layout",
    icon: Grid3x3,
    category: "Content",
  },
  {
    type: "gallery",
    name: "Image Gallery",
    description: "Display multiple images",
    icon: ImageIcon,
    category: "Media",
  },
  {
    type: "cta",
    name: "Call to Action",
    description: "Prominent action section",
    icon: Megaphone,
    category: "Marketing",
  },
  {
    type: "testimonials",
    name: "Testimonials",
    description: "Customer reviews and quotes",
    icon: Star,
    category: "Social Proof",
  },
  {
    type: "team",
    name: "Team Section",
    description: "Team member profiles",
    icon: Users,
    category: "About",
  },
  {
    type: "contact",
    name: "Contact Form",
    description: "Contact form with fields",
    icon: Mail,
    category: "Forms",
  },
]

export function BlockLibrary({ onClose, onSelectBlock }: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBlocks = blockTypes.filter(
    (block) =>
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = Array.from(new Set(blockTypes.map((b) => b.category)))

  return (
    <div className="w-96 border-l bg-background h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Block Library</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Blocks */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {searchQuery === "" ? (
            categories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{category}</h3>
                <div className="space-y-2">
                  {blockTypes
                    .filter((b) => b.category === category)
                    .map((block) => (
                      <Card
                        key={block.type}
                        className="cursor-pointer hover:bg-primary/5 hover:border-primary transition-colors"
                        onClick={() => onSelectBlock(block.type)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <block.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm mb-1">{block.name}</h4>
                              <p className="text-xs text-muted-foreground">{block.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {filteredBlocks.map((block) => (
                <Card
                  key={block.type}
                  className="cursor-pointer hover:bg-primary/5 hover:border-primary transition-colors"
                  onClick={() => onSelectBlock(block.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <block.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">{block.name}</h4>
                        <p className="text-xs text-muted-foreground">{block.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
