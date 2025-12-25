import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/[tenant]/footer
export async function GET(request: NextRequest, { params }: { params: { tenant: string } }) {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 })
  }

  // Mock data - in production, fetch from database based on tenant
  const footerData = {
    id: "main-footer",
    tenant: params.tenant,
    layout: "4-column",
    blocks: [
      {
        id: "block-1",
        type: "logo",
        column: 1,
        order: 1,
        data: {
          imageUrl: "/logo.svg",
          alt: "Company Logo",
          text: "Building the future of web platforms.",
        },
      },
      {
        id: "block-2",
        type: "menu",
        column: 2,
        order: 2,
        data: {
          title: "Quick Links",
          links: [
            { label: "Home", url: "/" },
            { label: "About", url: "/about" },
            { label: "Services", url: "/services" },
            { label: "Contact", url: "/contact" },
          ],
        },
      },
      {
        id: "block-3",
        type: "menu",
        column: 3,
        order: 3,
        data: {
          title: "Products",
          links: [
            { label: "SaaS", url: "/products/saas" },
            { label: "Enterprise", url: "/products/enterprise" },
            { label: "Pricing", url: "/pricing" },
          ],
        },
      },
      {
        id: "block-4",
        type: "social",
        column: 4,
        order: 4,
        data: {
          title: "Follow Us",
          platforms: [
            { name: "Twitter", url: "https://twitter.com/company", icon: "twitter" },
            { name: "LinkedIn", url: "https://linkedin.com/company", icon: "linkedin" },
            { name: "GitHub", url: "https://github.com/company", icon: "github" },
          ],
        },
      },
    ],
    bottomBar: {
      copyright: "© 2025 Company Inc. All rights reserved.",
      legalLinks: [
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Service", url: "/terms" },
        { label: "Cookie Policy", url: "/cookies" },
      ],
    },
    lastModified: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  }

  return NextResponse.json(footerData)
}
