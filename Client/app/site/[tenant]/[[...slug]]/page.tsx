import { BlockRenderer } from "@/components/site/block-renderer"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export default async function SitePage({ params }: { params: { tenant: string; slug?: string[] } }) {
  const slug = params.slug ? params.slug.join("/") : ""

  // In production, this would fetch from your database based on tenant + slug
  const pageData = {
    id: "1",
    title: "Welcome to Our Website",
    slug: slug || "/",
    tenant: params.tenant,
    blocks: [
      {
        id: "1",
        type: "hero",
        data: {
          title: "Build Amazing Websites",
          subtitle: "Create beautiful, professional websites without coding",
          buttonText: "Get Started",
          buttonLink: "/contact",
        },
      },
      {
        id: "2",
        type: "features",
        data: {
          title: "Why Choose Us",
          features: [
            { title: "Easy to Use", description: "Intuitive drag-and-drop interface", icon: "layout" },
            { title: "Fast Performance", description: "Lightning-fast page loads", icon: "zap" },
            { title: "Fully Responsive", description: "Works on all devices", icon: "smartphone" },
          ],
        },
      },
      {
        id: "3",
        type: "cta",
        data: {
          heading: "Ready to Get Started?",
          description: "Join thousands of happy customers building amazing websites",
          buttonText: "Start Free Trial",
          buttonLink: "/signup",
        },
      },
    ],
    seo: {
      metaTitle: "Welcome - Build Amazing Websites",
      metaDescription: "Create beautiful, professional websites without coding",
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader tenant={params.tenant} />
      <main className="flex-1">
        <BlockRenderer blocks={pageData.blocks} />
      </main>
      <SiteFooter tenant={params.tenant} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: { tenant: string; slug?: string[] } }) {
  // In production, fetch page metadata from database
  return {
    title: "Welcome - Build Amazing Websites",
    description: "Create beautiful, professional websites without coding",
  }
}
