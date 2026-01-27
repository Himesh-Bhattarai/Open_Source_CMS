import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;

  // 🚫 No role → not logged in
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🚫 Logged in but not admin
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/cms", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/admin/:path*"],
};
