import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/[tenant]/blog?limit=10&offset=0&category=tech
export async function GET(request: NextRequest, { params }: { params: { tenant: string } }) {
  const searchParams = request.nextUrl.searchParams
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = Number.parseInt(searchParams.get("offset") || "0")
  const category = searchParams.get("category")
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 })
  }

  // Mock data
  const blogPosts = [
    {
      id: "post-1",
      tenant: params.tenant,
      title: "Getting Started with Our Platform",
      slug: "getting-started",
      excerpt: "Learn how to build your first website in minutes",
      content: "<p>Full HTML content here...</p>",
      featuredImage: "/images/blog-1.jpg",
      author: {
        id: "user-1",
        name: "John Doe",
        avatar: "/avatars/john.jpg",
      },
      category: { id: "cat-1", name: "Tutorials", slug: "tutorials" },
      tags: ["beginner", "tutorial", "getting-started"],
      seo: {
        title: "Getting Started Guide",
        description: "Complete guide to getting started",
        keywords: ["tutorial", "guide"],
      },
      publishedAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "post-2",
      tenant: params.tenant,
      title: "Advanced Customization Tips",
      slug: "advanced-customization",
      excerpt: "Take your website to the next level with these tips",
      content: "<p>Full HTML content here...</p>",
      featuredImage: "/images/blog-2.jpg",
      author: {
        id: "user-2",
        name: "Jane Smith",
        avatar: "/avatars/jane.jpg",
      },
      category: { id: "cat-2", name: "Advanced", slug: "advanced" },
      tags: ["advanced", "customization", "tips"],
      seo: {
        title: "Advanced Customization Tips",
        description: "Expert tips for customization",
        keywords: ["advanced", "tips"],
      },
      publishedAt: "2025-01-20T14:30:00Z",
      updatedAt: "2025-01-20T14:30:00Z",
    },
  ]

  return NextResponse.json({
    posts: blogPosts.slice(offset, offset + limit),
    total: blogPosts.length,
    limit,
    offset,
    hasMore: offset + limit < blogPosts.length,
  })
}
