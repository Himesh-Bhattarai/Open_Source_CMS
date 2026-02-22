import { NextResponse } from "next/server";

const API_BASE_URL = process.env?.CMS_API_BASE_URL || "";
const API_KEY = process.env?.CMS_PUBLIC_API_KEY || "";
const DEFAULT_TENANT = process.env?.CMS_DEFAULT_TENANT_DOMAIN || "";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = (searchParams.get("tenant") || DEFAULT_TENANT).trim();

    if (!API_BASE_URL || !API_KEY || !tenant) {
      return NextResponse.json(
        {
          ok: true,
          data: null,
          fallback: true,
          message: "Public CMS API is not configured",
        },
        { status: 200 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/external-request/${encodeURIComponent(tenant)}/footer`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        cache: "no-store",
      },
    );

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        {
          ok: true,
          fallback: true,
          sourceStatus: response.status,
          message:
            payload?.error || payload?.message || "Footer service unavailable. Using fallback.",
          data: null,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: payload?.footer || payload?.data || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load footer";
    return NextResponse.json({ ok: true, fallback: true, message, data: null }, { status: 200 });
  }
}
