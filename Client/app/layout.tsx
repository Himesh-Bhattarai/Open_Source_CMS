import type React from "react"

import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { TenantProvider } from "@/context/TenantContext";
import "./globals.css"


const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metaData ={
  title: "Content Flow",
  description: "Headless CMS"
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
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
