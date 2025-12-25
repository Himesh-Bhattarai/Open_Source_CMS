"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function NewPagePage() {
  const params = useParams()
  const router = useRouter()
  const tenantId = params.id
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")

  const handleCreate = () => {
    router.push(`/cms/tenants/${tenantId}/pages/new-page-id`)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/cms/tenants/${tenantId}/pages`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Page</CardTitle>
          <CardDescription>Start building your page with content blocks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              placeholder="e.g., About Us"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">yoursite.com/</span>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="about-us" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Starting Template</Label>
            <div className="grid gap-3">
              {["Blank Page", "Landing Page", "Content Page", "Contact Page"].map((template) => (
                <Card key={template} className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-4 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{template}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button onClick={handleCreate} disabled={!title || !slug} className="w-full">
            Create Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
