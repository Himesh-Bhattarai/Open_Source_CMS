import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/[tenant]/pages/home
export async function GET(request: NextRequest, { params }: { params: { tenant: string; slug: string } }) {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 })
  }

  // Mock data - in production, fetch from database
  const pageData = {
    id: "page-1",
    tenant: params.tenant,
    slug: params.slug,
    title: "Welcome to Our Platform",
    metaDescription: "The best platform for building modern websites",
    blocks: [
      {
        id: "block-1",
        type: "hero",
        order: 1,
        data: {
          title: "Build Your Dream Website",
          subtitle: "No code required. Just drag, drop, and publish.",
          buttonText: "Get Started Free",
          buttonLink: "/signup",
          backgroundImage: "/images/hero-bg.jpg",
          alignment: "center",
        },
      },
      {
        id: "block-2",
        type: "features",
        order: 2,
        data: {
          title: "Why Choose Us",
          subtitle: "Everything you need in one platform",
          features: [
            {
              icon: "zap",
              title: "Lightning Fast",
              description: "Optimized for performance and speed",
            },
            {
              icon: "shield",
              title: "Secure by Default",
              description: "Enterprise-grade security built in",
            },
            {
              icon: "users",
              title: "Team Collaboration",
              description: "Work together seamlessly",
            },
          ],
        },
      },
      {
        id: "block-3",
        type: "cta",
        order: 3,
        data: {
          title: "Ready to Get Started?",
          description: "Join thousands of happy customers today",
          buttonText: "Start Free Trial",
          buttonLink: "/signup",
          secondaryButtonText: "Contact Sales",
          secondaryButtonLink: "/contact",
        },
      },
    ],
    seo: {
      title: "Welcome to Our Platform | Company Name",
      description: "The best platform for building modern websites",
      keywords: ["website builder", "cms", "no-code"],
      ogImage: "/images/og-image.jpg",
      canonical: `https://${params.tenant}.example.com/${params.slug}`,
    },
    publishedAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  }

  return NextResponse.json(pageData)
}
