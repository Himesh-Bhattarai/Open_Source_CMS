"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, FileText, Layers, Calendar, Edit, Copy, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function ContentTypesPage() {
  const [contentTypes] = useState([
    {
      id: "pages",
      name: "Pages",
      icon: FileText,
      description: "Standard pages for your website",
      fields: 8,
      entries: 24,
      isSystem: true,
    },
    {
      id: "blog",
      name: "Blog Posts",
      icon: Calendar,
      description: "News and articles",
      fields: 12,
      entries: 156,
      isSystem: true,
    },
    {
      id: "products",
      name: "Products",
      icon: Layers,
      description: "Product catalog items",
      fields: 15,
      entries: 89,
      isSystem: false,
    },
    {
      id: "testimonials",
      name: "Testimonials",
      icon: FileText,
      description: "Customer reviews and feedback",
      fields: 6,
      entries: 34,
      isSystem: false,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Content Types</h1>
          <p className="text-pretty text-muted-foreground mt-1">Define custom content structures for your data</p>
        </div>
        <Button asChild>
          <Link href="/cms/content/types/new">
            <Plus className="h-4 w-4 mr-2" />
            New Content Type
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contentTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <type.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {type.name}
                      {type.isSystem && (
                        <Badge variant="secondary" className="text-xs">
                          System
                        </Badge>
                      )}
                    </CardTitle>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/cms/content/types/${type.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Structure
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/cms/content/${type.id}`}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Entries
                      </Link>
                    </DropdownMenuItem>
                    {!type.isSystem && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="mt-2">{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">{type.fields}</span> fields
                </div>
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">{type.entries}</span> entries
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What are Content Types?</CardTitle>
          <CardDescription>Learn how to structure your content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Content types define the structure of your data. Each type contains a set of fields that determine what
            information can be stored.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-4 rounded-lg border bg-muted/30">
              <h4 className="font-medium mb-1">System Types</h4>
              <p className="text-sm text-muted-foreground">
                Built-in types like Pages and Blog Posts that power core CMS functionality
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <h4 className="font-medium mb-1">Custom Types</h4>
              <p className="text-sm text-muted-foreground">
                Create your own types for products, testimonials, team members, and more
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
