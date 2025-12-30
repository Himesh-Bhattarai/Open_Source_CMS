"use client"


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
}
