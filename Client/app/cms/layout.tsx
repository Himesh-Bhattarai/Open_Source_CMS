"use client"

import type React from "react"
import { CMSSidebar } from "@/components/cms/cms-sidebar"
import { CMSHeader } from "@/components/cms/cms-header"
import { useState, useEffect } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authToken = localStorage.getItem("cms_auth")

    if (!authToken) {
      // Not authenticated, redirect to login
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router, pathname])

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-muted/30">
        <CMSSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <CMSHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
