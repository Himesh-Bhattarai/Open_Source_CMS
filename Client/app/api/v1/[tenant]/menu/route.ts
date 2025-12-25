import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/[tenant]/menu?location=header
export async function GET(request: NextRequest, { params }: { params: { tenant: string } }) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location") || "header"
  const apiKey = request.headers.get("x-api-key")

  // Validate API key
  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 })
  }

  console.log("[v0] Fetching menu for tenant:", params.tenant, "location:", location)

  // Mock data - in production, fetch from database based on tenant
  const menuData = {
    id: "main-nav",
    location: location,
    tenant: params.tenant,
    items: [
      {
        id: "1",
        label: "Home",
        type: "internal",
        url: "/",
        order: 1,
        enabled: true,
        children: [],
      },
      {
        id: "2",
        label: "Products",
        type: "dropdown",
        url: "#",
        order: 2,
        enabled: true,
        children: [
          {
            id: "2-1",
            label: "SaaS Solutions",
            type: "internal",
            url: "/products/saas",
            order: 1,
            enabled: true,
          },
          {
            id: "2-2",
            label: "Enterprise",
            type: "internal",
            url: "/products/enterprise",
            order: 2,
            enabled: true,
          },
        ],
      },
      {
        id: "3",
        label: "About",
        type: "internal",
        url: "/about",
        order: 3,
        enabled: true,
        children: [],
      },
      {
        id: "4",
        label: "Blog",
        type: "internal",
        url: "/blog",
        order: 4,
        enabled: true,
        children: [],
      },
      {
        id: "5",
        label: "Contact",
        type: "internal",
        url: "/contact",
        order: 5,
        enabled: true,
        children: [],
      },
    ],
    lastModified: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  }

  return NextResponse.json(menuData, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  })
}
