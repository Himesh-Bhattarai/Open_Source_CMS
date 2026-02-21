import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { TenantProvider } from "@/context/TenantContext";
import { siteMetadataConfig } from "@/lib/seo/site-metadata";
import "./globals.css";


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadataConfig.siteUrl),
  title: {
    default: siteMetadataConfig.title,
    template: `%s | ${siteMetadataConfig.name}`,
  },
  description: siteMetadataConfig.description,
  applicationName: siteMetadataConfig.name,
  creator: siteMetadataConfig.name,
  publisher: siteMetadataConfig.name,
  keywords: [
    "content management system",
    "multi-tenant CMS",
    "website builder",
    "no-code CMS",
    "headless cms",
  ],
  openGraph: {
    title: siteMetadataConfig.title,
    description: siteMetadataConfig.description,
    url: siteMetadataConfig.siteUrl,
    siteName: siteMetadataConfig.name,
    type: "website",
    images: [siteMetadataConfig.defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadataConfig.title,
    description: siteMetadataConfig.description,
    creator: siteMetadataConfig.twitterHandle,
    images: [siteMetadataConfig.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/fav/favicon-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/fav/favicon-16x16.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/fav/favicon.ico",
        media: "(prefers-color-scheme: any)",
      },
    ],
    apple: "/fav/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          <TenantProvider>
            {children}
          </TenantProvider>
          <Toaster position="bottom-right" richColors closeButton />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
