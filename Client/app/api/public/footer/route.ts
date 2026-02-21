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
        { ok: false, message: "Public CMS API is not configured", data: null },
        { status: 500 },
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
          ok: false,
          message: payload?.error || payload?.message || "Failed to load footer",
          data: null,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      ok: true,
      data: payload?.footer || payload?.data || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error?.message || "Failed to load footer", data: null },
      { status: 500 },
    );
  }
}
