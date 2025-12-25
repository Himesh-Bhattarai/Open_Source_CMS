"use client"

/**
 * React hooks for ContentFlow CMS
 * Use these in client components for easy data fetching with caching
 */

import { useEffect, useState } from "react"
import type { MenuResponse, FooterResponse, PageResponse, BlogResponse, ThemeResponse } from "./index"

interface UseCMSOptions {
  baseUrl: string
  tenant: string
  apiKey: string
}

function useCMSFetch<T>(endpoint: string, options: UseCMSOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const url = `${options.baseUrl}/api/v1/${options.tenant}${endpoint}`
        const response = await fetch(url, {
          headers: {
            "X-API-Key": options.apiKey,
          },
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, options.baseUrl, options.tenant, options.apiKey])

  return { data, loading, error }
}

export function useMenu(location = "header", options: UseCMSOptions) {
  return useCMSFetch<MenuResponse>(`/menu?location=${location}`, options)
}

export function useFooter(options: UseCMSOptions) {
  return useCMSFetch<FooterResponse>("/footer", options)
}

export function usePage(slug: string, options: UseCMSOptions) {
  return useCMSFetch<PageResponse>(`/pages/${slug}`, options)
}

export function useBlog(params: { limit?: number; offset?: number } = {}, options: UseCMSOptions) {
  const queryParams = new URLSearchParams()
  if (params.limit) queryParams.append("limit", params.limit.toString())
  if (params.offset) queryParams.append("offset", params.offset.toString())
  const query = queryParams.toString()

  return useCMSFetch<BlogResponse>(`/blog${query ? `?${query}` : ""}`, options)
}

export function useTheme(options: UseCMSOptions) {
  const { data, loading, error } = useCMSFetch<ThemeResponse>("/theme", options)

  useEffect(() => {
    if (data && typeof window !== "undefined") {
      // Apply theme CSS variables to document root
      const root = document.documentElement
      root.style.setProperty("--cms-color-primary", data.colors.primary)
      root.style.setProperty("--cms-color-secondary", data.colors.secondary)
      root.style.setProperty("--cms-color-background", data.colors.background)
      root.style.setProperty("--cms-color-foreground", data.colors.foreground)
      root.style.setProperty("--cms-font-heading", data.typography.fontFamily.heading)
      root.style.setProperty("--cms-font-body", data.typography.fontFamily.body)
      root.style.setProperty("--cms-container-width", data.layout.containerWidth)
    }
  }, [data])

  return { theme: data, loading, error }
}
