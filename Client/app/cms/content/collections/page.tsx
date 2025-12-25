"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, FolderOpen, MoreVertical, Edit, Trash2, FileText } from "lucide-react"

const mockCollections = [
  {
    id: "products",
    name: "Products",
    description: "E-commerce product catalog",
    icon: "🛍️",
    itemCount: 45,
    fields: 12,
    lastUpdated: "2 hours ago",
  },
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Customer testimonials and reviews",
    icon: "💬",
    itemCount: 28,
    fields: 6,
    lastUpdated: "1 day ago",
  },
  {
    id: "team",
    name: "Team Members",
    description: "Company team member profiles",
    icon: "👥",
    itemCount: 12,
    fields: 8,
    lastUpdated: "3 days ago",
  },
  {
    id: "faqs",
    name: "FAQs",
    description: "Frequently asked questions",
    icon: "❓",
    itemCount: 34,
    fields: 4,
    lastUpdated: "5 days ago",
  },
]

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Manage custom content collections and entries</p>
        </div>
        <Link href="/cms/content/collections/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCollections.map((collection) => (
          <Card key={collection.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{collection.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <CardDescription className="mt-1">{collection.description}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Collection
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <Badge variant="secondary">{collection.itemCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fields</span>
                  <Badge variant="outline">{collection.fields}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Updated {collection.lastUpdated}</div>
                <Link href={`/cms/content/collections/${collection.id}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Items
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockCollections.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first collection to get started</p>
            <Link href="/cms/content/collections/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Collection
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
