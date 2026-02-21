import type { Metadata } from "next";
import type React from "react";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About ContentFlow",
  description:
    "Learn about ContentFlow, our mission, values, and the team building a practical multi-tenant CMS for modern websites.",
  path: "/about",
  keywords: ["about contentflow", "cms platform", "company mission", "website management"],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
