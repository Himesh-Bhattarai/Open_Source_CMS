"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "admin" | "web-owner"

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

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAdmin: boolean
  isOwner: boolean
  impersonatedTenant: { id: string; name: string } | null
  startImpersonation: (tenantId: string, tenantName: string) => void
  stopImpersonation: () => void
  isImpersonating: boolean
}

