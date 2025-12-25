"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Layout, Search, Eye, Download } from "lucide-react"
import Image from "next/image"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const templates = [
    {
      id: "1",
      name: "Business Pro",
      description: "Professional business website with contact forms",
      category: "business",
      blocks: 12,
      preview: "/placeholder.svg?height=400&width=600",
      featured: true,
    },
    {
      id: "2",
      name: "Creative Portfolio",
      description: "Showcase your work with stunning galleries",
      category: "portfolio",
      blocks: 8,
      preview: "/placeholder.svg?height=400&width=600",
      featured: true,
    },
    {
      id: "3",
      name: "Modern Blog",
      description: "Clean blog layout with sidebar and categories",
      category: "blog",
      blocks: 10,
      preview: "/placeholder.svg?height=400&width=600",
      featured: false,
    },
    {
      id: "4",
      name: "Landing Page",
      description: "High-converting landing page template",
      category: "marketing",
      blocks: 6,
      preview: "/placeholder.svg?height=400&width=600",
      featured: true,
    },
    {
      id: "5",
      name: "E-commerce Store",
      description: "Full-featured online store template",
      category: "ecommerce",
      blocks: 15,
      preview: "/placeholder.svg?height=400&width=600",
      featured: false,
    },
    {
      id: "6",
      name: "Restaurant Menu",
      description: "Elegant menu and reservation system",
      category: "restaurant",
      blocks: 9,
      preview: "/placeholder.svg?height=400&width=600",
      featured: false,
    },
  ]

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "business", label: "Business" },
    { id: "portfolio", label: "Portfolio" },
    { id: "blog", label: "Blog" },
    { id: "marketing", label: "Marketing" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "restaurant", label: "Restaurant" },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-3xl font-bold tracking-tight">Page Templates</h1>
        <p className="text-pretty text-muted-foreground mt-1">
          Start with pre-built templates and customize them to your needs
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={template.preview || "/placeholder.svg"}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                  {template.featured && <Badge className="absolute top-3 right-3 bg-primary">Featured</Badge>}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Layout className="h-4 w-4" />
                      <span>{template.blocks} blocks</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No templates found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
