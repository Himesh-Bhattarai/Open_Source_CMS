"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Archive, Trash2, Copy, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface BulkActionsBarProps {
  selectedCount: number
  onAction: (action: string) => void
  onCancel: () => void
}

export function BulkActionsBar({ selectedCount, onAction, onCancel }: BulkActionsBarProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
      <div className="flex items-center gap-3">
        <Badge variant="default" className="font-semibold">
          {selectedCount} selected
        </Badge>
        <span className="text-sm text-muted-foreground">Bulk Actions:</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onAction("publish")}>
          <Globe className="h-4 w-4 mr-2" />
          Publish
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAction("unpublish")}>
          <Archive className="h-4 w-4 mr-2" />
          Unpublish
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAction("duplicate")}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction("export")}>Export Selected</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("change-author")}>Change Author</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("add-tags")}>Add Tags</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onAction("delete")}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
