"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createPage } from "@/Api/Page/CreatePage"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash,
} from "lucide-react"

/* =========================
   TYPES (MATCH DB MODELS)
========================= */

type PageBlockType =
  | "hero"
  | "text"
  | "features"
  | "gallery"
  | "cta"
  | "testimonials"
  | "team"
  | "contact"
  | "custom"

interface PageBlock {
  id: string
  type: PageBlockType
  order: number
  data: any
}

export default function NewPageEditor() {
  const router = useRouter()

  /* =========================
     PAGE STATE (MATCH SCHEMA)
  ========================= */

  const [page, setPage] = useState({
    title: "",
    slug: "",
    blocks: [] as PageBlock[],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [] as string[],
      ogImage: "",
      noIndex: false,
    },
    status: "draft" as "draft" | "published" | "scheduled",
  })

  /* =========================
     HELPERS
  ========================= */

  const handleTitleChange = (title: string) => {
    setPage(prev => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }))
  }

  const addBlock = (type: PageBlockType) => {
    setPage(prev => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          id: crypto.randomUUID(),
          type,
          order: prev.blocks.length + 1,
          data: {},
        },
      ],
    }))
  }

  const updateBlock = (id: string, data: any) => {
    setPage(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === id ? { ...b, data: { ...b.data, ...data } } : b
      ),
    }))
  }

  const removeBlock = (id: string) => {
    setPage(prev => {
      const filtered = prev.blocks.filter(b => b.id !== id)
      return {
        ...prev,
        blocks: filtered.map((b, i) => ({
          ...b,
          order: i + 1,
        })),
      }
    })
  }

  const handleCreate = async () => {
    try {
      const data = {
        tenantId: "null for now" , 
        title: page.title,
        slug: page.slug,
        blocks: page.blocks.map(block => ({
          id: block.id,
          type: block.type,
          order: block.order,
          data: block.data,
        })),
        seo: page.seo,
        status: page.status,
      }

      console.log("CREATE PAGE PAYLOAD:", data)

      const createdPage = await createPage(data)

      router.push(`/cms/content/pages/${createdPage._id}`)
    } catch (error) {
      console.error("Failed to create page:", error)
    }
  }


  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cms/content/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">New Page</h1>
          <p className="text-muted-foreground">
            Create structured CMS pages
          </p>
        </div>

        <Button onClick={handleCreate} disabled={!page.title}>
          <Save className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>

      {/* PAGE META */}
      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={page.title}
              onChange={e => handleTitleChange(e.target.value)}
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              value={page.slug}
              onChange={e =>
                setPage({ ...page, slug: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* CONTENT BUILDER */}
      <Card>
        <CardHeader>
          <CardTitle>Content Blocks</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {page.blocks.map(block => (
            <div
              key={block.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="text-sm font-medium">
                {block.type.toUpperCase()} (#{block.order})
              </div>

              {/* HERO */}
              {block.type === "hero" && (
                <>
                  <Input
                    placeholder="Heading"
                    onChange={e =>
                      updateBlock(block.id, {
                        heading: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Subheading"
                    onChange={e =>
                      updateBlock(block.id, {
                        subheading: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Background image URL"
                    onChange={e =>
                      updateBlock(block.id, {
                        backgroundImage: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {/* TEXT */}
              {block.type === "text" && (
                <>
                  <Input
                    placeholder="Optional heading"
                    onChange={e =>
                      updateBlock(block.id, { heading: e.target.value })
                    }
                  />
                  <Textarea
                    rows={6}
                    placeholder="Text content"
                    onChange={e =>
                      updateBlock(block.id, { body: e.target.value })
                    }
                  />
                </>
              )}

              {/* FEATURES */}
              {block.type === "features" && (
                <Textarea
                  placeholder="JSON features array"
                  onChange={e =>
                    updateBlock(block.id, {
                      items: JSON.parse(e.target.value || "[]"),
                    })
                  }
                />
              )}

              {/* GALLERY */}
              {block.type === "gallery" && (
                <Textarea
                  placeholder="JSON images array"
                  onChange={e =>
                    updateBlock(block.id, {
                      images: JSON.parse(e.target.value || "[]"),
                    })
                  }
                />
              )}

              {/* CTA */}
              {block.type === "cta" && (
                <>
                  <Input
                    placeholder="CTA heading"
                    onChange={e =>
                      updateBlock(block.id, {
                        heading: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Button label"
                    onChange={e =>
                      updateBlock(block.id, {
                        button: {
                          ...(block.data.button || {}),
                          label: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Button link"
                    onChange={e =>
                      updateBlock(block.id, {
                        button: {
                          ...(block.data.button || {}),
                          href: e.target.value,
                        },
                      })
                    }
                  />
                </>
              )}

              {/* CONTACT */}
              {block.type === "contact" && (
                <>
                  <Input
                    placeholder="Email"
                    onChange={e =>
                      updateBlock(block.id, { email: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Phone"
                    onChange={e =>
                      updateBlock(block.id, { phone: e.target.value })
                    }
                  />
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => removeBlock(block.id)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Remove block
              </Button>
            </div>
          ))}

          {/* ADD BLOCKS */}
          <div className="flex flex-wrap gap-2">
            {[
              "hero",
              "text",
              "features",
              "gallery",
              "cta",
              "testimonials",
              "team",
              "contact",
              "custom",
            ].map(type => (
              <Button
                key={type}
                variant="outline"
                onClick={() => addBlock(type as PageBlockType)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
