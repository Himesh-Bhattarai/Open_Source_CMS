import type React from "react"

import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/sonner"
import { TenantProvider } from "@/context/TenantContext";
import "./globals.css"


const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

interface Metadata {
  title: string
  description: string
  icons: {
    icon: {
      url: string
      media: string
    }[]
    apple: string
  }
  }

export const metadata: Metadata = {
  title: "Content Flow",
  description: "Content Flow is a modern content management system designed to streamline your digital content workflow.",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
  )
}
