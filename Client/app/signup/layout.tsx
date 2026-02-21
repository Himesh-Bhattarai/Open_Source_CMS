import type { Metadata } from "next";
import type React from "react";
import { createPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Create Account",
  description: "Create a ContentFlow account and start building or managing websites with a multi-tenant CMS.",
  path: "/signup",
  noIndex: true,
});

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
