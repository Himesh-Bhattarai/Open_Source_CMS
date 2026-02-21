import type { Metadata } from "next";
import type React from "react";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Careers at ContentFlow",
  description:
    "Explore open roles at ContentFlow and help build production-grade CMS infrastructure for multi-tenant web teams.",
  path: "/careers",
  keywords: [
    "contentflow careers",
    "cms jobs",
    "frontend engineer",
    "backend engineer",
    "product designer",
  ],
});

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
