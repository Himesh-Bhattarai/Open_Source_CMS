"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, Copy } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActionsBar } from "@/components/cms/bulk-actions-bar"

// Mock blog data
const mockBlogPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    excerpt: "Learn about the latest features in Next.js 15 and how to migrate your apps",
    author: "Sarah K.",
    category: "Development",
    status: "published" as const,
    publishedDate: "2024-01-15",
    views: 1234,
    featuredImage: "/blog-nextjs.jpg",
  },
  {
    id: "2",
    title: "10 Tips for Better UX Design",
    excerpt: "Improve your user experience with these proven design principles",
    author: "Mike R.",
    category: "Design",
    status: "draft" as const,
    publishedDate: null,
    views: 0,
    featuredImage: "/blog-ux-design.jpg",
  },
  {
    id: "3",
    title: "The Future of Web Development",
    excerpt: "Exploring upcoming trends and technologies shaping the web",
    author: "Jane D.",
    category: "Technology",
    status: "published" as const,
    publishedDate: "2024-01-10",
    views: 892,
    featuredImage: "/blog-future-web.jpg",
  },
  {
    id: "4",
    title: "Mastering CSS Grid Layout",
    excerpt: "A comprehensive guide to building complex layouts with CSS Grid",
    author: "Tom B.",
    category: "Development",
    status: "scheduled" as const,
    publishedDate: "2024-01-20",
    views: 0,
    featuredImage: "/blog-css-grid.jpg",
  },
]

export default function BlogPostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedPosts.length === mockBlogPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(mockBlogPosts.map((post) => post.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedPosts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      scheduled: "outline",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content and articles</p>
        </div>
        <Link href="/cms/content/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBlogPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBlogPosts.filter((p) => p.status === "published").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBlogPosts.filter((p) => p.status === "draft").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBlogPosts.reduce((acc, p) => acc + p.views, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>Search and filter your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Blog Posts Table */}
          <div className="border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 w-12">
                      <Checkbox
                        checked={selectedPosts.length === mockBlogPosts.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4 font-medium">Post</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Author</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Views</th>
                    <th className="text-left p-4 font-medium">Published</th>
                    <th className="text-right p-4 font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockBlogPosts.map((post) => (
                    <tr key={post.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedPosts.includes(post.id)}
                          onCheckedChange={() => toggleSelect(post.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.featuredImage || "/placeholder.svg"}
                            alt={post.title}
                            className="w-16 h-10 object-cover rounded border"
                          />
                          <div>
                            <Link href={`/cms/content/blog/${post.id}`} className="font-medium hover:underline">
                              {post.title}
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{post.category}</Badge>
                      </td>
                      <td className="p-4 text-sm">{post.author}</td>
                      <td className="p-4">{getStatusBadge(post.status)}</td>
                      <td className="p-4 text-sm">{post.views.toLocaleString()}</td>
                      <td className="p-4 text-sm">{post.publishedDate || "-"}</td>
                      <td className="p-4">
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
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedPosts.length}
          onPublish={() => console.log("[v0] Bulk action publish on blog posts:", selectedPosts)}
          onUnpublish={() => console.log("[v0] Bulk action unpublish on blog posts:", selectedPosts)}
          onDuplicate={() => console.log("[v0] Bulk action duplicate on blog posts:", selectedPosts)}
          onDelete={() => console.log("[v0] Bulk action delete on blog posts:", selectedPosts)}
          onCancel={() => setSelectedPosts([])}
        />
      )}
    </div>
  )
}
