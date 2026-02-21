import type { Metadata } from "next";
import type React from "react";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read the ContentFlow Privacy Policy to understand how we collect, use, and protect personal and usage data.",
  path: "/privacy",
  keywords: ["privacy policy", "contentflow privacy", "data protection", "user data"],
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
