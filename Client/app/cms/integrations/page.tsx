"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Code, Copy, ExternalLink, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { integrationsApi } from "@/Api/integrations/Fetch"
import { toast } from "sonner"
import { INTEGRATION_DOCS_ROUTE, buildApiTestCommand } from "@/lib/docs/integration-guides"
import Link from "next/link"

// Type definitions for API response
interface Endpoint {
  key: string;
  url: string;
  status: "ready" | "connected" | "disconnected";
  lastCalledAt: string | null;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "ready" | "connected" | "disconnected";
  endpoints: Endpoint[];
  _uniqueId: string;
}

interface TenantData {
  tenantId: string;
  domain: string;
  integrations: Integration[];
}

interface ApiResponse {
  success: boolean;
  data: TenantData[];
}

export default function IntegrationsPage() {
  const { user } = useAuth()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [apiList, setApiList] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  // Fetch integrations data from API
  useEffect(() => {
    const loadApisList = async () => {
      setLoading(true)
      setErrorMessage("")

      try {
        const loadApi = await integrationsApi()

        if (loadApi?.ok && Array.isArray(loadApi.data)) {
      
          const allIntegrations = loadApi.data.flatMap(tenant =>
            (tenant.integrations || []).map((integration : Integration)=> ({
              ...integration,
              _uniqueId: `${tenant.tenantId}-${integration.id}` 
            }))
          )
          setApiList(allIntegrations)
        } else {
          setApiList([])
          setErrorMessage("Failed to load integrations from API")
        }
      } catch (error) {
        console.error("Error loading integrations:", error)
        setApiList([])
        setErrorMessage("Error loading integrations. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadApisList()
  }, [])

  // Calculate connected and total counts
  const connectedCount = apiList.filter((integration) =>
    integration.status === "ready" || integration.status === "connected"
  ).length

  const totalCount = apiList.length

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Format endpoint key for display
  const formatEndpointKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(':', ' - ')
  }

  // Copy endpoint URL to clipboard
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleCopyTestCommand = (integration: Integration) => {
    const endpoint = getFirstEndpoint(integration)
    if (!endpoint || endpoint === "#") {
      toast.error("No endpoint available to test")
      return
    }

    const command = buildApiTestCommand(endpoint)
    if (!command) {
      toast.error("Unable to build test command")
      return
    }

    navigator.clipboard.writeText(command)
    setCopiedKey(`${integration.id}-test`)
    setTimeout(() => setCopiedKey(null), 2000)
    toast.success("Test command copied. Run it in terminal.")
  }

  // Get first connected endpoint for Test API button
  const getFirstEndpoint = (integration: Integration) => {
    if (!integration.endpoints || integration.endpoints.length === 0) {
      return "#"
    }

    const connectedEndpoint = integration.endpoints.find(
      endpoint => endpoint.status === "ready" || endpoint.status === "connected"
    )

    return connectedEndpoint?.url || integration.endpoints[0].url
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-2">Connect your website features to the CMS</p>
      </div>

      {/* Loading State */}
      {loading && (
        <Alert>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading integrations...
          </div>
        </Alert>
      )}

      {/* Error Display */}
      {errorMessage && !loading && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* No Integrations State */}
      {!loading && apiList.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No integrations found</h3>
            <p className="text-muted-foreground mt-2">
              Set up your first integration in the CMS settings
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!loading && apiList.length > 0 && (
        <>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Only features that are integrated with your website will appear in the navigation.
              Connect features using the APIs below.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>
                {connectedCount} of {totalCount} features connected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: totalCount > 0
                        ? `${(connectedCount / totalCount) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {totalCount > 0
                    ? `${Math.round((connectedCount / totalCount) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Integrations Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {apiList.map((integration) => {
              const isConnected = integration.status === "ready" || integration.status === "connected"

              return (
                <Card
                  key={integration._uniqueId}
                  className={isConnected ? "border-green-600/50" : ""}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {integration.name}
                          {isConnected ? (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {formatStatus(integration.status)}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Disconnected
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                   
                    {integration.endpoints && integration.endpoints.length > 0 ? (
                      integration.endpoints.map((endpoint, index) => (
                        <div key={`${integration._uniqueId}-${endpoint.key}`}>

                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">
                              {formatEndpointKey(endpoint.key)}
                            </label>
                            <div className="flex items-center gap-2">
                              {endpoint.status === "ready" || endpoint.status === "connected" ? (
                                <Badge
                                  variant="outline"
                                  className="h-5 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                >
                                  {formatStatus(endpoint.status)}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="h-5 text-xs">
                                  {formatStatus(endpoint.status)}
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(endpoint.url, `${integration.id}-${endpoint.key}`)}
                                className="h-7 text-xs"
                              >
                                {copiedKey === `${integration.id}-${endpoint.key}` ? (
                                  "Copied!"
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <code className="block text-xs bg-muted p-2 rounded border break-all">
                            {endpoint.url}
                          </code>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        No endpoints configured
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        asChild
                      >
                        <Link href={`${INTEGRATION_DOCS_ROUTE}#${integration.id}`}>
                          <Code className="h-4 w-4 mr-2" />
                          View Docs
                        </Link>
                      </Button>

                      {isConnected ? (
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={!integration.endpoints || integration.endpoints.length === 0}
                          onClick={() => handleCopyTestCommand(integration)}
                        >
                          {copiedKey === `${integration.id}-test` ? (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Test API
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button size="sm" variant="default" className="flex-1" asChild>
                          <Link href={`${INTEGRATION_DOCS_ROUTE}#${integration.id}`}>
                            Setup Guide
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* How Integration Works Card */}
          <Card>
            <CardHeader>
              <CardTitle>How Integration Works</CardTitle>
              <CardDescription>Connecting your website to ContentFlow CMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">1. Your Website Calls the API</h3>
                <p className="text-muted-foreground">
                  Your existing website makes HTTP requests to ContentFlow APIs to fetch content (menu, footer, pages, etc.)
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Edit Content in the CMS</h3>
                <p className="text-muted-foreground">
                  You log into this dashboard and make changes (edit menu items, update footer, create pages)
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Changes Appear Automatically</h3>
                <p className="text-muted-foreground">
                  Your website automatically shows the updated content without any code changes or redeployment
                </p>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>For Developers:</strong> Use terminal docs at{" "}
                  <code className="text-xs">{INTEGRATION_DOCS_ROUTE}</code> and test endpoints with saved cookie sessions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
