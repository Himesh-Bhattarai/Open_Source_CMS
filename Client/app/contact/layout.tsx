import type { Metadata } from "next";
import type React from "react";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact ContentFlow",
  description:
    "Contact the ContentFlow team for product questions, sales inquiries, and support related to your CMS platform.",
  path: "/contact",
  keywords: ["contact contentflow", "cms support", "sales inquiry", "website cms help"],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
