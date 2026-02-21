import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const role = req.cookies.get("role")?.value;

  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (role !== "admin") {
    return NextResponse.redirect(new URL("/cms", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/admin/:path*"],
};
