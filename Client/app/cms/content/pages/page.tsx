"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Edit, Eye, Trash2, Copy, CheckSquare, Square } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BulkActionsBar } from "@/components/cms/bulk-actions-bar"
import { AdvancedSearch } from "@/components/cms/advanced-search"

export default function PagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [authorFilter, setAuthorFilter] = useState("all")
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set())

  const [pages] = useState([
    { id: "1", title: "Homepage", path: "/", status: "published", lastEdited: "2 hours ago", author: "Sarah K." },
    { id: "2", title: "About Us", path: "/about", status: "published", lastEdited: "1 day ago", author: "Mike R." },
    { id: "3", title: "Services", path: "/services", status: "draft", lastEdited: "3 hours ago", author: "Sarah K." },
    { id: "4", title: "Contact", path: "/contact", status: "published", lastEdited: "5 days ago", author: "Admin" },
    { id: "5", title: "Pricing", path: "/pricing", status: "draft", lastEdited: "1 hour ago", author: "Sarah K." },
    { id: "6", title: "Blog", path: "/blog", status: "published", lastEdited: "2 days ago", author: "Mike R." },
    { id: "7", title: "Team", path: "/team", status: "draft", lastEdited: "4 hours ago", author: "Admin" },
    { id: "8", title: "Careers", path: "/careers", status: "published", lastEdited: "1 week ago", author: "Sarah K." },
  ])

  const authors = ["Sarah K.", "Mike R.", "Admin"]

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      searchQuery === "" ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || page.status === statusFilter
    const matchesAuthor = authorFilter === "all" || page.author === authorFilter
    return matchesSearch && matchesStatus && matchesAuthor
  })

  const handleSelectAll = () => {
    if (selectedPages.size === filteredPages.length) {
      setSelectedPages(new Set())
    } else {
      setSelectedPages(new Set(filteredPages.map((p) => p.id)))
    }
  }

  const handleSelectPage = (pageId: string) => {
    const newSelected = new Set(selectedPages)
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId)
    } else {
      newSelected.add(pageId)
    }
    setSelectedPages(newSelected)
  }

  const handleBulkAction = (action: string) => {
    console.log(`[v0] Bulk action ${action} on pages:`, Array.from(selectedPages))
    setTimeout(() => {
      setSelectedPages(new Set())
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-pretty text-muted-foreground mt-1">
            Manage your site pages and content • {filteredPages.length} {filteredPages.length === 1 ? "page" : "pages"}
          </p>
        </div>
        <Button asChild>
          <Link href="/cms/content/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages by title or URL..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={authorFilter} onValueChange={setAuthorFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All authors</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AdvancedSearch />
            </div>

            {selectedPages.size > 0 && (
              <BulkActionsBar
                selectedCount={selectedPages.size}
                onAction={handleBulkAction}
                onCancel={() => setSelectedPages(new Set())}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Select All Header */}
            <div className="flex items-center gap-4 px-4 py-2 text-sm text-muted-foreground font-medium border-b">
              <button onClick={handleSelectAll} className="flex items-center hover:text-foreground transition-colors">
                {selectedPages.size === filteredPages.length && filteredPages.length > 0 ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="ml-2">Select all</span>
              </button>
              <span className="flex-1">Title</span>
              <span className="w-24">Status</span>
              <span className="w-32">Last edited</span>
              <span className="w-24">Actions</span>
            </div>

            {/* Page List */}
            {filteredPages.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-1">No pages found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredPages.map((page) => (
                <div
                  key={page.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors ${
                    selectedPages.has(page.id) ? "bg-muted/50 border-primary" : ""
                  }`}
                >
                  <button
                    onClick={() => handleSelectPage(page.id)}
                    className="flex items-center justify-center hover:text-primary transition-colors"
                  >
                    {selectedPages.has(page.id) ? (
                      <CheckSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{page.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {page.path} • {page.author}
                    </p>
                  </div>
                  <div className="w-24">
                    <Badge variant={page.status === "published" ? "default" : "secondary"}>{page.status}</Badge>
                  </div>
                  <div className="w-32 text-sm text-muted-foreground">{page.lastEdited}</div>
                  <div className="w-24 flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/cms/content/pages/${page.id}`}>
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
