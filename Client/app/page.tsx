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
export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const directMe = async () => {
      try {
        const res = await verifyMe();

        if (!res.ok) {
          // user not verified → stay on landing/login page
          setLoading(false);
        } 
        // user verified → redirect to dashboard
          router.push("/cms");
        
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

  // const pricing = [
  //   {
  //     name: "Starter",
  //     price: "$29",
  //     period: "/month",
  //     description: "Perfect for small websites",
  //     features: ["1 Website", "10GB Storage", "Basic Support", "All Features"],
  //   },
  //   {
  //     name: "Professional",
  //     price: "$79",
  //     period: "/month",
  //     description: "For growing businesses",
  //     features: ["5 Websites", "50GB Storage", "Priority Support", "Advanced Analytics", "Custom Domain"],
  //     popular: true,
  //   },
  //   {
  //     name: "Enterprise",
  //     price: "$199",
  //     period: "/month",
  //     description: "For large organizations",
  //     features: [
  //       "Unlimited Websites",
  //       "500GB Storage",
  //       "24/7 Support",
  //       "Custom Integrations",
  //       "Dedicated Manager",
  //       "SLA Guarantee",
  //     ],
  //   },
  // ]

  if (loading) {
    return <LoadingScreen />; // show your logo/login bar while verifying
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
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#use-cases" className="text-sm font-medium hover:text-primary transition-colors">
              Use Cases
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
              Docs
            </Link>
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
            {/* <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div> */}
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

      {/* Pricing
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, idx) => (
              <Card key={idx} className={`relative ${plan.popular ? "border-primary border-2 shadow-lg" : "border-2"}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to Build Your Website?</h2>
            <p className="text-xl text-white/90">
              Join thousands of users who trust ContentFlow to power their websites
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-base">
                <Link href="/signup">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base border-white text-white hover:bg-white hover:text-primary bg-transparent"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CF</span>
                </div>
                <span className="font-bold text-lg">ContentFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">Build and manage beautiful websites without code</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-primary">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 ContentFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
