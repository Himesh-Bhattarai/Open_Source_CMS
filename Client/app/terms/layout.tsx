import type { Metadata } from "next";
import type React from "react";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Review the ContentFlow Terms of Service covering account use, subscriptions, content responsibilities, and policies.",
  path: "/terms",
  keywords: ["terms of service", "contentflow terms", "user agreement", "subscription terms"],
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
