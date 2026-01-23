"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Code, Copy, ExternalLink, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { integrationsApi } from "@/Api/integrations/Fetch"

export default function IntegrationsPage() {
  const { user } = useAuth()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const[apiList, setApiList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const[message, setMessage] = useState("");


  useEffect(()=>{
    const loadApisList = async()=>{
      setLoading(true);
      setMessage("");
      const loadApi = await integrationsApi();
      console.log("API LIST:", loadApi);
      console.log("API LIST:", loadApi?.data);
      console.log("API LIST:", loadApi?.data?.data);

      if(loadApi?.ok){
        //manage state
        setLoading(false);
        setApiList(loadApi?.data)
        setMessage("Successfully loaded APIs");
      }
      setMessage("Failed to load APIs");
    }

    loadApisList();
  },[])

  const integrations = [
    {
      id: "menu",
      name: "Navigation Menu",
      description: "Allow your website to fetch navigation menus dynamically",
      status: user?.integrations?.menu || false,
      endpoint: `/api/v1/${user?.tenantId}/menu`,
      docs: "/docs/API_INTEGRATION.md#menu-api",
    },
    {
      id: "footer",
      name: "Footer Content",
      description: "Manage footer links and content from the CMS",
      status: user?.integrations?.footer || false,
      endpoint: `/api/v1/${user?.tenantId}/footer`,
      docs: "/docs/API_INTEGRATION.md#footer-api",
    },
    {
      id: "pages",
      name: "Dynamic Pages",
      description: "Render pages with block-based content from the CMS",
      status: user?.integrations?.pages || false,
      endpoint: `/api/v1/${user?.tenantId}/pages/[slug]`,
      docs: "/docs/API_INTEGRATION.md#pages-api",
    },
    {
      id: "blog",
      name: "Blog Posts",
      description: "Fetch and display blog posts on your website",
      status: user?.integrations?.blog || false,
      endpoint: `/api/v1/${user?.tenantId}/blog`,
      docs: "/docs/API_INTEGRATION.md#blog-api",
    },
    {
      id: "theme",
      name: "Theme Settings",
      description: "Apply theme colors and styles from the CMS",
      status: user?.integrations?.theme || false,
      endpoint: `/api/v1/${user?.tenantId}/theme`,
      docs: "/docs/API_INTEGRATION.md#theme-api",
    },
    {
      id: "seo",
      name: "SEO & Meta Tags",
      description: "Manage meta tags and SEO settings centrally",
      status: user?.integrations?.seo || false,
      endpoint: `/api/v1/${user?.tenantId}/seo`,
      docs: "/docs/API_INTEGRATION.md#seo-settings",
    },
  ]

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const connectedCount = integrations.filter((i) => i.status).length
  const totalCount = integrations.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-2">Connect your website features to the CMS</p>
      </div>

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
                style={{ width: `${(connectedCount / totalCount) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium">{Math.round((connectedCount / totalCount) * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id} className={integration.status ? "border-green-600/50" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {integration.name}
                    {integration.status ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Connected
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1.5">{integration.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">API Endpoint</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(integration.endpoint, integration.id)}
                    className="h-7 text-xs"
                  >
                    {copiedKey === integration.id ? "Copied!" : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <code className="block text-xs bg-muted p-2 rounded border break-all">{integration.endpoint}</code>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                  <a href={integration.docs} target="_blank" rel="noopener noreferrer">
                    <Code className="h-4 w-4 mr-2" />
                    View Docs
                  </a>
                </Button>
                {integration.status ? (
                  <Button size="sm" className="flex-1" asChild>
                    <a href={integration.endpoint} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test API
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="default" className="flex-1">
                    Setup Guide
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  )
}
