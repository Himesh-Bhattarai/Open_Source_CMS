import type { Metadata } from "next";
import type React from "react";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "ContentFlow API Documentation",
  description:
    "Read ContentFlow external API documentation for pages, menu, footer, SEO, media, and tenant integrations.",
  path: "/docs",
  keywords: ["contentflow api", "cms api docs", "external request api", "developer documentation"],
});

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
