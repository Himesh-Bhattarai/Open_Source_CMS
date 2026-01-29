"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { blogPostApi } from "@/Api/Blog/createBlog"
import { useTenant } from "@/context/TenantContext"
import { checkSlugAvailability } from "@/Api/Services/listServices.js"

export default function NewBlogPost() {
  const router = useRouter()
  const { tenants, activeTenant, setActiveTenant, selectedTenantId } =
    useTenant()

  const isTenantSelected = !!selectedTenantId

  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "Development",
    status: "draft",
  })

  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle")

  // Live slug check
  useEffect(() => {
    if (!blogData.slug || !selectedTenantId) return
    const value = "BlogCreation"

    const delay = setTimeout(async () => {
      setSlugStatus("checking")
      const ok = await checkSlugAvailability(
        blogData.slug,
        selectedTenantId,
        value
      )
      setSlugStatus(ok ? "available" : "taken")
    }, 500)

    return () => clearTimeout(delay)
  }, [blogData.slug, selectedTenantId])

  const handleCreate = async () => {
    if (!selectedTenantId) {
      alert("Select a website first")
      return
    }

    if (slugStatus !== "available") {
      alert("Slug is not available")
      return
    }

    try {
      const blogPost = await blogPostApi({
        ...blogData,
        tenantId: selectedTenantId,
      })

      if (blogPost?.blogId) {
        router.push(`/cms/content/blog/${blogPost.blogId}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

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
            <h1 className="text-2xl font-bold">New Blog Post</h1>
            <p className="text-sm text-muted-foreground">
              Create a new blog post
            </p>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={!isTenantSelected || slugStatus !== "available"}
        >
          <Save className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Tenant Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Website</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedTenantId || ""}
            onValueChange={(id) =>
              setActiveTenant(tenants.find(t => t._id === id)!)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((t) => (
                <SelectItem key={t._id} value={t._id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Lock everything until tenant chosen */}
      <div className={!isTenantSelected ? "opacity-50 pointer-events-none" : ""}>
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>
                  Enter the basic information for your blog post
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={blogData.title}
                    onChange={(e) =>
                      setBlogData({
                        ...blogData,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^\w-]/g, ""),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={blogData.slug}
                    onChange={(e) =>
                      setBlogData({ ...blogData, slug: e.target.value })
                    }
                  />

                  {slugStatus === "checking" && (
                    <p className="text-sm text-muted-foreground">Checking…</p>
                  )}
                  {slugStatus === "available" && (
                    <p className="text-sm text-green-600">
                      Slug available ✓
                    </p>
                  )}
                  {slugStatus === "taken" && (
                    <p className="text-sm text-red-600">
                      Slug already in use
                    </p>
                  )}
                </div>

                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    value={blogData.excerpt}
                    onChange={(e) =>
                      setBlogData({
                        ...blogData,
                        excerpt: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={blogData.status}
                  onValueChange={(v) =>
                    setBlogData({ ...blogData, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={blogData.category}
                  onValueChange={(v) =>
                    setBlogData({ ...blogData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
