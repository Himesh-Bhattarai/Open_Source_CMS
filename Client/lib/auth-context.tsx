"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "admin" | "owner"

export interface TenantIntegrations {
  menu: boolean
  footer: boolean
  pages: boolean
  blog: boolean
  theme: boolean
  seo: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  tenantId?: string
  tenantName?: string
  avatar?: string
  integrations?: TenantIntegrations
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAdmin: boolean
  isOwner: boolean
  impersonatedTenant: { id: string; name: string } | null
  startImpersonation: (tenantId: string, tenantName: string) => void
  stopImpersonation: () => void
  isImpersonating: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Admin User",
    email: "admin@contentflow.com",
    role: "admin", // Change to "owner" to test owner view
  })

  const [impersonatedTenant, setImpersonatedTenant] = useState<{ id: string; name: string } | null>(null)

  const isAdmin = user?.role === "admin"
  const isOwner = user?.role === "owner"
  const isImpersonating = isAdmin && impersonatedTenant !== null

  const startImpersonation = (tenantId: string, tenantName: string) => {
    if (isAdmin) {
      setImpersonatedTenant({ id: tenantId, name: tenantName })
    }
  }

  const stopImpersonation = () => {
    setImpersonatedTenant(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
        isOwner,
        impersonatedTenant,
        startImpersonation,
        stopImpersonation,
        isImpersonating,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
