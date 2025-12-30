"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GripVertical, Trash2, Settings, Plus, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Block {
  id: string
  type: string
  data: any
}

interface BlockBuilderProps {
  blocks: Block[]
  onBlocksChange: (blocks: Block[]) => void
  onAddBlock: () => void
}

export function BlockBuilder({ blocks, onBlocksChange, onAddBlock }: BlockBuilderProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)

  const handleBlockUpdate = (blockId: string, field: string, value: any) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, data: { ...block.data, [field]: value } } : block,
    )
    onBlocksChange(updatedBlocks)
  }

  const handleBlockDelete = (blockId: string) => {
    onBlocksChange(blocks.filter((block) => block.id !== blockId))
    setSelectedBlockId(null)
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedBlockId || draggedBlockId === targetBlockId) return

    const draggedIndex = blocks.findIndex((b) => b.id === draggedBlockId)
    const targetIndex = blocks.findIndex((b) => b.id === targetBlockId)

    if (draggedIndex === targetIndex) return

    const newBlocks = [...blocks]
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, draggedBlock)

    onBlocksChange(newBlocks)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDraggedBlockId(null)
  }

  const handleDragEnd = () => {
    setDraggedBlockId(null)
  }

  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Headline</label>
              <Input
                value={block.data.title || ""}
                onChange={(e) => handleBlockUpdate(block.id, "title", e.target.value)}
                placeholder="Enter headline"
                className="text-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subtitle</label>
              <Input
                value={block.data.subtitle || ""}
                onChange={(e) => handleBlockUpdate(block.id, "subtitle", e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Button Text</label>
              <Input
                value={block.data.buttonText || ""}
                onChange={(e) => handleBlockUpdate(block.id, "buttonText", e.target.value)}
                placeholder="Get Started"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Button Link</label>
              <Input
                value={block.data.buttonLink || ""}
                onChange={(e) => handleBlockUpdate(block.id, "buttonLink", e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>
        )

      case "text":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Heading</label>
              <Input
                value={block.data.heading || ""}
                onChange={(e) => handleBlockUpdate(block.id, "heading", e.target.value)}
                placeholder="Enter heading"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                value={block.data.content || ""}
                onChange={(e) => handleBlockUpdate(block.id, "content", e.target.value)}
                placeholder="Enter your content..."
                rows={6}
              />
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Section Title</label>
              <Input
                value={block.data.title || ""}
                onChange={(e) => handleBlockUpdate(block.id, "title", e.target.value)}
                placeholder="Our Features"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Features</label>
              <p className="text-sm text-muted-foreground">Feature list editor would go here</p>
            </div>
          </div>
        )

      case "gallery":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Gallery Title</label>
              <Input
                value={block.data.title || ""}
                onChange={(e) => handleBlockUpdate(block.id, "title", e.target.value)}
                placeholder="Photo Gallery"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Images</label>
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Images
              </Button>
            </div>
          </div>
        )

      case "cta":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Heading</label>
              <Input
                value={block.data.heading || ""}
                onChange={(e) => handleBlockUpdate(block.id, "heading", e.target.value)}
                placeholder="Ready to get started?"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={block.data.description || ""}
                onChange={(e) => handleBlockUpdate(block.id, "description", e.target.value)}
                placeholder="Join thousands of happy customers"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Button Text</label>
              <Input
                value={block.data.buttonText || ""}
                onChange={(e) => handleBlockUpdate(block.id, "buttonText", e.target.value)}
                placeholder="Sign Up Now"
              />
            </div>
          </div>
        )

      default:
        return <p className="text-sm text-muted-foreground">No editor available for this block type</p>
    }
  }

  const renderBlockPreview = (block: Block) => {
    switch (block.type) {
      case "hero":
        return (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-12 rounded-lg text-center">
            <h1 className="text-4xl font-bold mb-4">{block.data.title || "Hero Headline"}</h1>
            <p className="text-xl text-muted-foreground mb-6">{block.data.subtitle || "Hero subtitle text"}</p>
            {block.data.buttonText && (
              <Button size="lg" className="mt-2">
                {block.data.buttonText}
              </Button>
            )}
          </div>
        )

      case "text":
        return (
          <div className="p-8">
            {block.data.heading && <h2 className="text-2xl font-bold mb-4">{block.data.heading}</h2>}
            <p className="text-muted-foreground leading-relaxed">{block.data.content || "Text content goes here..."}</p>
          </div>
        )

      case "features":
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">{block.data.title || "Features"}</h2>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Feature {i}</h3>
                  <p className="text-sm text-muted-foreground">Description</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "gallery":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">{block.data.title || "Gallery"}</h2>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        )

      case "cta":
        return (
          <div className="bg-primary text-primary-foreground p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">{block.data.heading || "Call to Action"}</h2>
            <p className="text-lg mb-6 opacity-90">{block.data.description || "Compelling description text"}</p>
            <Button size="lg" variant="secondary">
              {block.data.buttonText || "Take Action"}
            </Button>
          </div>
        )

      default:
        return <div className="p-8 text-center text-muted-foreground">Block preview</div>
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Block List */}
      <div className="col-span-2 space-y-4">
        {blocks.map((block) => (
          <Card
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={(e) => handleDragOver(e, block.id)}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={`cursor-move hover:shadow-lg transition-all ${
              selectedBlockId === block.id ? "ring-2 ring-primary" : ""
            } ${draggedBlockId === block.id ? "opacity-50" : ""}`}
            onClick={() => setSelectedBlockId(block.id)}
          >
            <CardContent className="p-0">
              {/* Block Header */}
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <div>
                    <Badge variant="secondary" className="capitalize">
                      {block.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBlockId(block.id)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBlockDelete(block.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Block Preview */}
              <div className="bg-background">{renderBlockPreview(block)}</div>
            </CardContent>
          </Card>
        ))}

        {blocks.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No blocks yet. Add your first block to get started.</p>
              <Button onClick={onAddBlock}>
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Block Editor Sidebar */}
      <div className="sticky top-4 h-fit">
        {selectedBlockId ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Edit Block</h3>
                <Badge variant="secondary" className="capitalize">
                  {blocks.find((b) => b.id === selectedBlockId)?.type}
                </Badge>
              </div>
              {renderBlockEditor(blocks.find((b) => b.id === selectedBlockId)!)}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Select a block to edit its content</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
