import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(tenant: string, apiKey: string): string {
  return `${tenant}:${apiKey}`
}

function checkRateLimit(key: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply to API routes
  if (pathname.startsWith("/api/v1/")) {
    const apiKey = request.headers.get("x-api-key")
    const tenantMatch = pathname.match(/\/api\/v1\/([^/]+)/)
    const tenant = tenantMatch?.[1]

    // Validate API key presence
    if (!apiKey) {
      return NextResponse.json({ error: "API key required. Add X-API-Key header." }, { status: 401 })
    }

    // Validate tenant
    if (!tenant) {
      return NextResponse.json({ error: "Invalid API endpoint" }, { status: 400 })
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(tenant, apiKey)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Maximum 100 requests per minute",
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
          },
        },
      )
    }

    // In production, validate API key against database
    // For now, just check it's not empty and has proper format
    if (!apiKey.startsWith("cms_")) {
      return NextResponse.json({ error: "Invalid API key format" }, { status: 401 })
    }

    // Add CORS headers for external sites
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", "*") // In production, whitelist specific domains
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, X-API-Key")

    return response
  }

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/v1/:path*"],
}
