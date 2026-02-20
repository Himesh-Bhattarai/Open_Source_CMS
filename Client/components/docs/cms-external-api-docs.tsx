import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CmsExternalApiDocsProps {
  backHref: string;
  backLabel: string;
}

export function CmsExternalApiDocs({
  backHref,
  backLabel,
}: CmsExternalApiDocsProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CMS External API Docs</h1>
            <p className="text-muted-foreground mt-2">
              Terminal-first workflow for integrating and testing CMS APIs safely.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Terminal Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md border bg-muted/40 p-4 text-xs whitespace-pre-wrap overflow-x-auto">
{`=== CMS External API Docs ===

Welcome to your CMS API guide. Follow these steps to fetch data for your website.

Step 1: Get your API Key
- Go to Account Settings -> API Keys
- Copy your API key (mocked here for demo: DEMO_API_KEY)

Step 2: Get your Integration Endpoint
- Go to Integrations -> API Endpoint
- Copy the endpoint (mocked here: https://demo-your-website.com/api/v1)

Step 3: Fetch Pages (Simulated)
> Terminal Command (curl):
curl -H "x-api-key: DEMO_API_KEY" https://demo-your-website.com/api/v1/page/user-pages

> Mocked JSON Response:
[
  {"id": "page_001", "title": "Home", "slug": "home"},
  {"id": "page_002", "title": "About Us", "slug": "about-us"}
]

Step 4: Fetch Single Blog (Simulated)
> Terminal Command (curl):
curl -H "x-api-key: DEMO_API_KEY" https://demo-your-website.com/api/v1/blog/load/BLOG_ID

> Mocked JSON Response:
{
  "id": "blog_001",
  "title": "My First Blog",
  "content": "This is a mocked blog post."
}

Step 5: Frontend Example (JavaScript)
fetch("https://demo-your-website.com/api/v1/page/user-pages", {
  headers: {"x-api-key": "DEMO_API_KEY"}
})
.then(res => res.json())
.then(data => console.log(data));

Notes:
- Replace DEMO_API_KEY and demo URL with your real key and endpoint.
- Use this guide to learn the workflow safely.`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
