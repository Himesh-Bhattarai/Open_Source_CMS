"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Globe,
  Layout,
  Menu,
  Palette,
  Users,
  Lock,
  Zap,
  Code,
  Database,
  BarChart,
  FileText,
  ArrowRight,
  Check,
  Layers,
  Eye,
  Download,
} from "lucide-react"
import { useEffect, useState } from "react"
import { verifyMe } from "@/Api/Auth/VerifyAuth"
import { useRouter } from "next/navigation"
import LoadingScreen from "@/lib/loading"
import {fetchMenu as loadNavigation } from "@/Api/ExternalCall/Navigation"
import { fetchFooter } from "@/Api/ExternalCall/Footer"
import Footer from "@/components/Footer"

interface MenuItem {
  _id: string;
  label: string;
  link: string;
  enabled: boolean;
  order: number;
  type: "internal" | "external";
  children: MenuItem[];
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [footerData, setFooterData] = useState<any >(null)


  // Fall back to default menu if API fails
  const defaultMenu=[
    {
      _id: "1",
      label: "Features",
      link: "#features",
      enabled: true,
      order: 1,
    },
    {
      _id: "2",
      label: "Use Cases",
      link: "#use-cases",
      enabled: true,
      order: 2,
    },
    {
      _id: "3",
      label: "Contact",
      link: "#contact",
      enabled: true,
      order: 3,
    },
  ]

  const router = useRouter();
  //falback for footer data if API fails
const footerFallback = {
    layout: "custom",
    blocks: [
      {
        id: "fallback-text",
        type: "text",
        data: {
          title: "ContentFlow",
          content: "Build and manage beautiful websites without code",
        },
      },
      {
        id: "fallback-product",
        type: "menu",
        data: {
          title: "Product",
          links: [
            { id: "features", label: "Features", slug: "#features" },
            { id: "docs", label: "Documentation", slug: "/docs" },
          ],
        },
      },
      {
        id: "fallback-company",
        type: "menu",
        data: {
          title: "Company",
          links: [
            { id: "about", label: "About", slug: "/about" },
            { id: "contact", label: "Contact", slug: "/contact" },
          ],
        },
      },
      {
        id: "fallback-legal",
        type: "menu",
        data: {
          title: "Legal",
          links: [
            { id: "privacy", label: "Privacy Policy", slug: "/privacy" },
            { id: "terms", label: "Terms of Service", slug: "/terms" },
          ],
        },
      },
    ],
    bottomBar: {
      copyrightText: "© 2025 ContentFlow. All rights reserved.",
      socialLinks: [],
    },
  }

  

  useEffect(() => {
    const loadAll = async () => {
      try {
        const navRes = await loadNavigation()
        if (navRes.ok && Array.isArray(navRes.data) && navRes.data[0]?.items) {
          setMenuItems(navRes.data[0].items)
        } else {
          setMenuItems(defaultMenu as MenuItem[])
        }

        const footerRes = await fetchFooter()

        setFooterData(footerRes?.data)
        
      } catch (err) {
        console.error(err)
        setMenuItems(defaultMenu as MenuItem[])
      } finally {
        setLoading(false)
      }
    }
    
    loadAll()
  }, [])
  

  useEffect(() => {
    const directMe = async () => {
      try {
        const res = await verifyMe();
        if (res.ok) {
          router.push("/cms");
          return;
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    directMe();
  }, [router]);

  const features = [
    {
      icon: Layout,
      title: "Block-Based Page Builder",
      description: "Drag and drop content blocks to build beautiful pages without code",
    },
    {
      icon: Globe,
      title: "Multi-Tenant Architecture",
      description: "Manage multiple independent websites from one powerful platform",
    },
    {
      icon: Menu,
      title: "Visual Menu Builder",
      description: "Create navigation menus with nested dropdowns and live preview",
    },
    {
      icon: Palette,
      title: "Theme Customization",
      description: "Customize colors, fonts, and layouts with real-time preview",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Invite team members with granular role-based permissions",
    },
    {
      icon: Database,
      title: "Dynamic Content Types",
      description: "Create custom content structures for products, portfolios, and more",
    },
    {
      icon: FileText,
      title: "Blog Management",
      description: "Complete blogging system with categories, tags, and SEO",
    },
    {
      icon: BarChart,
      title: "Analytics Dashboard",
      description: "Track performance with comprehensive metrics and insights",
    },
    {
      icon: Lock,
      title: "Security First",
      description: "Tenant isolation, role-based access, and secure authentication",
    },
    {
      icon: Code,
      title: "API Integration",
      description: "REST APIs for integrating with existing websites",
    },
    {
      icon: Eye,
      title: "Live Preview",
      description: "See changes in real-time before publishing",
    },
    {
      icon: Download,
      title: "Automated Backups",
      description: "Scheduled backups with one-click restore",
    },
  ]

  const useCases = [
    {
      title: "Website Owners",
      description: "Build and manage your website without technical knowledge",
      benefits: ["No coding required", "Professional templates", "Easy content updates"],
    },
    {
      title: "Agencies",
      description: "Manage all your client websites from one platform",
      benefits: ["Multi-tenant support", "White-label ready", "Team collaboration"],
    },
    {
      title: "Developers",
      description: "Integrate CMS with existing projects via API",
      benefits: ["RESTful APIs", "Webhook support", "Custom integrations"],
    },
  ]

  if (loading) {
    return <LoadingScreen />
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="font-bold text-xl">ContentFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map(item => (
              item?.enabled  && (
                <Link
                  key={item?._id}
                  href={item?.link}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item?.label}
                </Link>
              )
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              No-Code Website Builder(v1.0.0)
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build & Manage Websites{" "}
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Without Code
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ContentFlow is a powerful multi-tenant CMS that lets you create, manage, and publish professional websites
              using our visual block-based editor. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <Link href="/signup">
                  Start with us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need to Build Websites</h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed for both beginners and professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Everyone</h2>
            <p className="text-xl text-muted-foreground">Whether you're a business owner, agency, or developer</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {useCases.map((useCase, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                  <CardDescription className="text-base">{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {useCase.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How ContentFlow Works</h2>
            <p className="text-xl text-muted-foreground">Get your website online in minutes</p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your account in seconds", icon: Users },
              { step: "2", title: "Choose Template", description: "Pick from professional designs", icon: Layers },
              { step: "3", title: "Customize Content", description: "Edit with drag-and-drop blocks", icon: Layout },
              { step: "4", title: "Publish", description: "Go live with one click", icon: Zap },
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <item.icon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}

      <Footer footer={footerData || footerFallback} />
    </div>
  )
}
