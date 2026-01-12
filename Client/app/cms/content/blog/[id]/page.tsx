"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ArrowLeft, Save, Eye, ChevronDown, ChevronUp, Calendar, Tag, ImageIcon } from "lucide-react"

export default function BlogPostEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [blogData, setBlogData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [seoOpen, setSeoOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // const [blogData, setBlogData] = useState({
  //   title: "Getting Started with Next.js 15",
  //   slug: "getting-started-nextjs-15",
  //   excerpt: "Learn about the latest features in Next.js 15",
  //   content: "Full blog post content goes here...",
  //   featuredImage: "/blog-featured.jpg",
  //   category: "Development",
  //   tags: ["nextjs", "react", "web-development"],
  //   author: "Sarah K.",
  //   publishDate: "2024-01-15",
  //   status: "published",
  //   seo: {
  //     metaTitle: "Getting Started with Next.js 15 | ContentFlow Blog",
  //     metaDescription: "Learn about the latest features in Next.js 15 and how to migrate your apps",
  //     focusKeyword: "nextjs 15",
  //   },
  //   settings: {
  //     featured: true,
  //     allowComments: true,
  //     showAuthor: true,
  //     showDate: true,
  //   },
  // })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cms/content/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Blog Post</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{blogData.status}</Badge>
              <span className="text-sm text-muted-foreground">Last saved 2 minutes ago</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>Write and format your blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={blogData.title}
                  onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                  placeholder="Enter post title"
                />
                <div className="text-xs text-muted-foreground">{blogData.title.length} characters</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={blogData.slug}
                  onChange={(e) => setBlogData({ ...blogData, slug: e.target.value })}
                  placeholder="post-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={blogData.excerpt}
                  onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                  placeholder="Brief summary of your post"
                  rows={3}
                />
                <div className="text-xs text-muted-foreground">{blogData.excerpt.length} characters</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={blogData.content}
                  onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                  placeholder="Write your blog post content..."
                  rows={15}
                  className="font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  {blogData.content.split(" ").length} words, {blogData.content.length} characters
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
              <CardHeader className="cursor-pointer" onClick={() => setSeoOpen(!seoOpen)}>
                <div className="flex items-center justify-between">
                  <CardTitle>SEO Settings</CardTitle>
                  {seoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                <CardDescription>Optimize for search engines</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={blogData.seo.metaTitle}
                      onChange={(e) =>
                        setBlogData({
                          ...blogData,
                          seo: { ...blogData.seo, metaTitle: e.target.value },
                        })
                      }
                      placeholder="SEO title"
                    />
                    <div className="text-xs text-muted-foreground">{blogData.seo.metaTitle.length} / 60 characters</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={blogData.seo.metaDescription}
                      onChange={(e) =>
                        setBlogData({
                          ...blogData,
                          seo: { ...blogData.seo, metaDescription: e.target.value },
                        })
                      }
                      placeholder="SEO description"
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground">
                      {blogData.seo.metaDescription.length} / 160 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="focusKeyword">Focus Keyword</Label>
                    <Input
                      id="focusKeyword"
                      value={blogData.seo.focusKeyword}
                      onChange={(e) =>
                        setBlogData({
                          ...blogData,
                          seo: { ...blogData.seo, focusKeyword: e.target.value },
                        })
                      }
                      placeholder="Primary keyword"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
              <CardHeader className="cursor-pointer" onClick={() => setSettingsOpen(!settingsOpen)}>
                <div className="flex items-center justify-between">
                  <CardTitle>Advanced Settings</CardTitle>
                  {settingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="featured">Featured Post</Label>
                      <p className="text-sm text-muted-foreground">Show in featured section</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={blogData.settings.featured}
                      onCheckedChange={(checked) =>
                        setBlogData({
                          ...blogData,
                          settings: { ...blogData.settings, featured: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowComments">Allow Comments</Label>
                      <p className="text-sm text-muted-foreground">Enable reader comments</p>
                    </div>
                    <Switch
                      id="allowComments"
                      checked={blogData.settings.allowComments}
                      onCheckedChange={(checked) =>
                        setBlogData({
                          ...blogData,
                          settings: { ...blogData.settings, allowComments: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showAuthor">Show Author</Label>
                      <p className="text-sm text-muted-foreground">Display author info</p>
                    </div>
                    <Switch
                      id="showAuthor"
                      checked={blogData.settings.showAuthor}
                      onCheckedChange={(checked) =>
                        setBlogData({
                          ...blogData,
                          settings: { ...blogData.settings, showAuthor: checked },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={blogData.status} onValueChange={(value) => setBlogData({ ...blogData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={blogData.publishDate}
                  onChange={(e) => setBlogData({ ...blogData, publishDate: e.target.value })}
                />
              </div>

              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Publish Now
              </Button>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                  {blogData.featuredImage ? (
                    <img
                      src={blogData.featuredImage || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">No image selected</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={blogData.category}
                  onValueChange={(value) => setBlogData({ ...blogData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" value={blogData.tags.join(", ")} placeholder="Separate tags with commas" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {blogData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">SK</span>
                </div>
                <div>
                  <p className="font-medium">{blogData.author}</p>
                  <p className="text-sm text-muted-foreground">Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
