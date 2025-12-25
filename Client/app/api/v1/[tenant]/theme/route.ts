import { type NextRequest, NextResponse } from "next/server"

// GET /api/v1/[tenant]/theme
export async function GET(request: NextRequest, { params }: { params: { tenant: string } }) {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 })
  }

  // Mock data
  const themeData = {
    id: "theme-1",
    tenant: params.tenant,
    name: "Company Theme",
    colors: {
      primary: "#3B82F6",
      secondary: "#10B981",
      background: "#FFFFFF",
      foreground: "#000000",
      muted: "#F3F4F6",
      accent: "#8B5CF6",
    },
    typography: {
      fontFamily: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      fontSize: {
        base: "16px",
        h1: "48px",
        h2: "36px",
        h3: "28px",
        h4: "20px",
      },
    },
    layout: {
      containerWidth: "1280px",
      spacing: "1rem",
      borderRadius: "8px",
    },
    header: {
      style: "centered",
      position: "sticky",
      logo: {
        url: "/logo.svg",
        height: "40px",
      },
    },
    footer: {
      style: "multi-column",
      columns: 4,
    },
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(themeData)
}
