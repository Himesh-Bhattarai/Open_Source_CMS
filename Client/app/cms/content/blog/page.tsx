"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkActionsBar } from "@/components/cms/bulk-actions-bar";
import { loadAllBlogs } from "@/Api/Blog/Load";
import { deleteBlogById } from "@/Api/Blog/Delete";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

         

// Blog post type
type BlogPost = {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  status: "draft" | "published" | "scheduled";
  publishedDate: string | null;
  views: number;
  featuredImage: string | null;
};

export default function BlogPostsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogPost[]>([]);

  // Load all blogs from API
  useEffect(() => {
    async function load() {
      try {
        const data = await loadAllBlogs();
        setBlog(data);
      } catch (err) {
        console.error("Error loading blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  //delete blog function
  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteBlogById(id);
      if (response?.ok) {
        setBlog((prevBlog) => prevBlog.filter((post) => post._id !== id));
        toast.success("Blog post deleted successfully.");
      } else {
        toast.error("Failed to delete blog post.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog post.");
      setLoading(false);
    }
  };

  // Toggle select all posts
  const toggleSelectAll = () => {
    if (selectedPosts.length === blog.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(blog.map((post) => post._id));
    }
  };

  // Toggle single post selection
  const toggleSelect = (id: string) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      scheduled: "outline",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Filtered blogs
  const filteredBlogs = blog.filter((post) => {
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog content and articles
          </p>
        </div>
        <Link href="/cms/content/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blog.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blog.filter((p) => p.status === "published").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blog.filter((p) => p.status === "draft").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blog.reduce((acc, p) => acc + p.views, 0)}
            </div>
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

          {/* Blog table */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-4 w-12">
                    <Checkbox
                      checked={selectedPosts.length === blog.length}
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
                {filteredBlogs.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedPosts.includes(post._id)}
                        onCheckedChange={() => toggleSelect(post._id)}
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
                          <Link
                            href={`/cms/content/blog/${post._id}`}
                            className="font-medium hover:underline"
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{post.category}</Badge>
                    </td>
                    <td className="p-4 text-sm">{post.author}</td>
                    <td className="p-4">{getStatusBadge(post.status)}</td>
                    <td className="p-4 text-sm">
                      {post.views.toLocaleString()}
                    </td>
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
                          <DropdownMenuItem onClick={() => router.push(`/cms/content/blog/${post._id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteBlog(post._id)}
                          >
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
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedPosts.length}
          onAction={(action) => console.log(action, selectedPosts)}
          onPublish={() => console.log("Publish:", selectedPosts)}
          onUnpublish={() => console.log("Unpublish:", selectedPosts)}
          onDuplicate={() => console.log("Duplicate:", selectedPosts)}
          onDelete={() => console.log("Delete:", selectedPosts)}
          onCancel={() => setSelectedPosts([])}
        />
      )}
    </div>
  );
}
