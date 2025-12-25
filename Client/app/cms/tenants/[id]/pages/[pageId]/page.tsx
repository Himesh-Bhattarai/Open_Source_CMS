"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Eye, Save, Settings } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { BlockBuilder } from "@/components/cms/block-builder"
import { BlockLibrary } from "@/components/cms/block-library"

export default function PageBuilderPage() {
  const params = useParams()
  const tenantId = params.id
  const pageId = params.pageId
  const [blocks, setBlocks] = useState([
    { id: "1", type: "hero", data: { title: "Welcome to Our Website", subtitle: "Build amazing experiences" } },
    { id: "2", type: "features", data: { title: "Our Features", items: [] } },
  ])
  const [showLibrary, setShowLibrary] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Main Builder Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-background flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/cms/tenants/${tenantId}/pages`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pages
              </Link>
            </Button>
            <div>
              <h1 className="font-semibold">Homepage</h1>
              <p className="text-xs text-muted-foreground">{blocks.length} blocks</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Builder Content */}
        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="max-w-5xl mx-auto space-y-4">
            <Card
              className="p-4 flex items-center justify-center border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
              onClick={() => setShowLibrary(true)}
            >
              <Button variant="ghost" className="h-20">
                <Plus className="h-6 w-6 mr-2" />
                Add Block
              </Button>
            </Card>

            <BlockBuilder blocks={blocks} onBlocksChange={setBlocks} onAddBlock={() => setShowLibrary(true)} />
          </div>
        </div>
      </div>

      {/* Block Library Sidebar */}
      {showLibrary && (
        <BlockLibrary
          onClose={() => setShowLibrary(false)}
          onSelectBlock={(blockType) => {
            const newBlock = {
              id: Date.now().toString(),
              type: blockType,
              data: {},
            }
            setBlocks([...blocks, newBlock])
            setShowLibrary(false)
          }}
        />
      )}
    </div>
  )
}
