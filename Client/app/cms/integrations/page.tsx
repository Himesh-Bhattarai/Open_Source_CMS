"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Code, Copy, ExternalLink, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { integrationsApi } from "@/Api/integrations/Fetch"

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
  const [message, setMessage] = useState("")

  // Fetch integrations data from API
  useEffect(() => {
    const loadApisList = async () => {
      setLoading(true)
      setMessage("")

      try {
        const loadApi = await integrationsApi()
        console.log("Load Api", loadApi)

        if (loadApi?.ok && Array.isArray(loadApi.data)) {
          // Flatten all integrations from all tenants
          const allIntegrations = loadApi.data.flatMap(tenant =>
            (tenant.integrations || []).map((integration : Integration)=> ({
              ...integration,
              _uniqueId: `${tenant.tenantId}-${integration.id}` // unique per tenant
            }))
          )
          setApiList(allIntegrations)


          setMessage(
            allIntegrations.length
              ? "Successfully loaded integrations"
              : "No integrations found"
          )
        } else {
          setApiList([])
          setMessage("Failed to load integrations from API")
        }
      } catch (error) {
        console.error("Error loading integrations:", error)
        setApiList([])
        setMessage("Error loading integrations. Please try again.")
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

      {/* Message Display */}
      {message && !loading && (
        <Alert variant={message.includes("Failed") || message.includes("Error") ? "destructive" : "default"}>
          <AlertDescription>{message}</AlertDescription>
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
                    {/* Render Multiple Endpoints */}
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
                        <a
                          href={`/docs/API_INTEGRATION.md#${integration.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Code className="h-4 w-4 mr-2" />
                          View Docs
                        </a>
                      </Button>

                      {isConnected ? (
                        <Button
                          size="sm"
                          className="flex-1"
                          asChild
                          disabled={!integration.endpoints || integration.endpoints.length === 0}
                        >
                          <a
                            href={getFirstEndpoint(integration)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (!integration.endpoints || integration.endpoints.length === 0) {
                                e.preventDefault()
                              }
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Test API
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                        >
                          Setup Guide
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
                  <strong>For Developers:</strong> Share the API documentation with your web developer to integrate these
                  features. See <code className="text-xs">/docs/API_INTEGRATION.md</code> for complete implementation
                  examples.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}