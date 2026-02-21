import type { Metadata } from "next";
import type React from "react";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Sign In",
  description: "Sign in to your ContentFlow account to manage websites, pages, SEO, and tenant settings.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
