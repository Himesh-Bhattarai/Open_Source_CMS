"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {PageContent} from "@/lib/types/page"

export interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  content: PageContent
  previewUrl: string
  environment: string
  seoPreview?: string   // ← ADD THIS
}

export function PreviewModal({
  isOpen,
  onClose,
  content,
  previewUrl = "/",
  environment,
  seoPreview,       // <-- accept it even if you don't render yet
}: PreviewModalProps) {

  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }


  const deviceSizes = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-[1024px]",
    mobile: "w-[375px] h-[667px]",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle>Preview</DialogTitle>
              <Badge variant={content.status === "published" ? "default" : "secondary"}>{content.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={device} onValueChange={(v) => setDevice(v as typeof device)}>
                <TabsList>
                  <TabsTrigger value="desktop" className="gap-2">
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </TabsTrigger>
                  <TabsTrigger value="tablet" className="gap-2">
                    <Tablet className="h-4 w-4" />
                    Tablet
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="gap-2">
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center bg-muted/30 p-6 overflow-auto">
          <div
            className={`${deviceSizes[device]} bg-background border rounded-lg shadow-lg overflow-hidden transition-all`}
          >
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">/{content.slug}</p>
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  Live preview would render your actual page content here with all styles and interactions.
                </p>
                <Button variant="outline" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
