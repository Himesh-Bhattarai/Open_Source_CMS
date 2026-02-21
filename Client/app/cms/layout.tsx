import type { Metadata } from "next";
import type React from "react";
import CMSLayoutClient from "./layout-client";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "CMS Dashboard",
  description:
    "Secure dashboard for managing websites, content, users, and settings in ContentFlow.",
  path: "/cms",
  noIndex: true,
});

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return <CMSLayoutClient>{children}</CMSLayoutClient>;
}
