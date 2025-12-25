import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users, Target, Heart, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="font-bold text-xl">ContentFlow</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ContentFlow</h1>
          <p className="text-xl text-muted-foreground mb-12">
            We're on a mission to make website creation accessible to everyone, regardless of technical expertise.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower individuals and businesses to create, manage, and publish professional websites without
                  writing a single line of code.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simplicity, reliability, and customer success drive everything we do. We believe powerful tools should
                  be easy to use.
                </p>
              </CardContent>
            </Card>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Why ContentFlow?</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                ContentFlow was born from the frustration of seeing talented people held back by technical barriers. Too
                many great ideas never see the light of day because building a website seems too complex or expensive.
              </p>
              <p>
                We created ContentFlow to change that. Our platform combines the power of professional web development
                tools with an intuitive, visual interface that anyone can use. Whether you're a small business owner,
                creative professional, or large agency, ContentFlow gives you the tools to build and manage beautiful
                websites.
              </p>
              <p>
                Today, thousands of users trust ContentFlow to power their online presence. From personal blogs to
                e-commerce stores and corporate websites, our platform handles it all with ease.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">What Sets Us Apart</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Zap className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">No Code Required</h4>
                  <p className="text-sm text-muted-foreground">
                    Build professional websites with our visual drag-and-drop editor
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Multi-Tenant</h4>
                  <p className="text-sm text-muted-foreground">Manage multiple websites from one powerful dashboard</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Heart className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Customer First</h4>
                  <p className="text-sm text-muted-foreground">Dedicated support team ready to help you succeed</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="text-center bg-muted/30 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Join Us on This Journey</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're building your first website or managing dozens, ContentFlow is here to help you succeed.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Get Started Today</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
