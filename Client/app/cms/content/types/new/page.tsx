"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, FileText, Layers, Calendar, Users, Package } from "lucide-react"
import Link from "next/link"

const templates = [
  {
    name: "Blog Post",
    icon: FileText,
    description: "Articles with title, content, author, and publish date",
    fields: ["Title", "Content", "Author", "Published Date", "Featured Image"],
  },
  {
    name: "Product",
    icon: Package,
    description: "E-commerce products with pricing and inventory",
    fields: ["Name", "Description", "Price", "SKU", "Stock", "Images"],
  },
  {
    name: "Team Member",
    icon: Users,
    description: "Staff profiles with bio and social links",
    fields: ["Name", "Position", "Bio", "Photo", "Social Links"],
  },
  {
    name: "Event",
    icon: Calendar,
    description: "Events with dates, location, and registration",
    fields: ["Title", "Date", "Location", "Description", "Registration Link"],
  },
]

export default function NewContentTypePage() {
  const router = useRouter()
  const [step, setStep] = useState<"template" | "custom">("template")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleCreateFromTemplate = (template: (typeof templates)[0]) => {
    router.push(`/cms/content/types/new-${template.name.toLowerCase().replace(" ", "-")}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cms/content/types">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-balance text-3xl font-bold tracking-tight">New Content Type</h1>
          <p className="text-pretty text-muted-foreground mt-1">Start from a template or create from scratch</p>
        </div>
      </div>

      {step === "template" && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card
                key={template.name}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCreateFromTemplate(template)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <template.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{template.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.map((field) => (
                        <span key={field} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Start from Scratch</CardTitle>
              <CardDescription>Create a custom content type with your own fields</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => setStep("custom")}>
                <Layers className="h-4 w-4 mr-2" />
                Create Custom Type
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {step === "custom" && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Content Type</CardTitle>
            <CardDescription>Configure the basic information for your content type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Products, Team Members, Events"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">This will be used to identify your content type</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this content type is used for"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep("template")}>
                Back to Templates
              </Button>
              <Button onClick={() => router.push("/cms/content/types/new-custom")} disabled={!formData.name}>
                <Save className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
