"use client"

import { useState, useRef } from "react"
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
import {checkSlugAvailability } from "@/Api/Page/Services"
import {createPage} from "@/Api/Page/CreatePage"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Save,
  Trash,
  Shield,
  Hash,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTenant } from "@/context/TenantContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { PageType, Visibility } from "@/lib/types/page"



// ========== TYPE DEFINITIONS ==========
type InlineNodeType = 'text' | 'bold' | 'italic' | 'link' | 'button' | 'feature' | 'badge'

interface InlineNode {
  id: string
  type: InlineNodeType
  props: Record<string, any>
  children: InlineNode[]
}

type ContentNodeType = 'heading' | 'paragraph' | 'image' | 'button' | 'link' | 'badge' | 'icon' |
  'subheading' | 'quote' | 'personName' | 'avatarImage' | 'rating' | 'company' |
  'feature' | 'video' | 'caption' | 'question' | 'answer'

interface ContentNode {
  id: string
  type: ContentNodeType
  props: Record<string, any>
  children: InlineNode[]
}

type SectionType = 'hero' | 'paragraph' | 'testimonial' | 'cta' | 'features' | 'gallery' | 'faq'

interface Section {
  id: string
  type: SectionType
  order: number
  props: Record<string, any>
  children: ContentNode[]
}

interface PageTree {
  sections: Section[]
}

// ========== HELPER FUNCTIONS ==========
const createInlineNode = (type: InlineNodeType = 'text', props: Record<string, any> = {}): InlineNode => ({
  id: crypto.randomUUID(),
  type,
  props,
  children: []
})

const createContentNode = (type: ContentNodeType, props: Record<string, any> = {}): ContentNode => ({
  id: crypto.randomUUID(),
  type,
  props,
  children: [createInlineNode('text', { content: '' })]
})

const createSection = (type: SectionType): Section => {
  const baseSection: Section = {
    id: crypto.randomUUID(),
    type,
    order: 0,
    props: {},
    children: []
  }

  // Initialize with appropriate children based on section type
  switch (type) {
    case 'hero':
      baseSection.children = [
        createContentNode('heading', { level: 1 }),
        createContentNode('subheading', { level: 2 }),
        createContentNode('paragraph', {}),
        createContentNode('image', { src: '', alt: '' }),
        createContentNode('button', { href: '#', variant: 'primary' })
      ]
      break
    case 'paragraph':
      baseSection.children = [
        createContentNode('heading', { level: 2 }),
        createContentNode('paragraph', {}),
        createContentNode('image', { src: '', alt: '', alignment: 'left' }),
        createContentNode('link', { href: '#' })
      ]
      break
    case 'testimonial':
      baseSection.children = [
        createContentNode('quote', {}),
        createContentNode('personName', {}),
        createContentNode('avatarImage', { src: '', alt: '' }),
        createContentNode('rating', { value: 5 }),
        createContentNode('company', {})
      ]
      break
    case 'cta':
      baseSection.children = [
        createContentNode('heading', { level: 2 }),
        createContentNode('paragraph', {}),
        createContentNode('button', { href: '#', variant: 'primary' }),
        createContentNode('badge', { variant: 'default' })
      ]
      break
    case 'features':
      baseSection.children = [
        createContentNode('heading', { level: 2 }),
        createContentNode('paragraph', {}),
        createContentNode('feature', { icon: '', color: 'default' }),
        createContentNode('button', { href: '#', variant: 'outline' })
      ]
      break
    case 'gallery':
      baseSection.children = [
        createContentNode('image', { src: '', alt: '' }),
        createContentNode('video', { src: '', controls: true }),
        createContentNode('caption', {}),
        createContentNode('link', { href: '#' })
      ]
      break
    case 'faq':
      baseSection.children = [
        createContentNode('question', {}),
        createContentNode('answer', {}),
        createContentNode('link', { href: '#' })
      ]
      break
  }

  return baseSection
}

export default function NewPageEditor() {
  const router = useRouter()
  const { tenants } = useTenant()
  const [selectedTenantId, setSelectedTenantId] = useState("")
  const [slugValidation, setSlugValidation] = useState({
    isValid: true,
    message: "",
    isChecking: false
  })

  const slugCheckId = useRef(0)

  // Updated state with proper typing
  const [page, setPage] = useState<{
    title: string
    slug: string
    pageTree: PageTree
    seo: {
      metaTitle: string
      metaDescription: string
      keywords: string[]
      ogImage: string
      noIndex: boolean
      canonicalUrl: string
      robots: {
        index: boolean
        follow: boolean
        maxImagePreview: "standard"
      }
      openGraph: {
        title: string
        description: string
        image: string
        type: "website"
      }
      twitter: {
        card: "summary_large_image"
        title: string
        description: string
        image: string
      }
      structuredData: Record<string, any>
      sitemapInclusion: boolean
    }
    status: "draft"
    settings: {
      pageType: PageType
      visibility: Visibility
      featured: boolean
      allowComments: boolean
      template: string
      authorId: string
      parentId: string | undefined
      isHomepage: boolean
    }
  }>({
    title: "",
    slug: "",
    pageTree: {
      sections: []
    },
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      ogImage: "",
      noIndex: false,
      canonicalUrl: "",
      robots: {
        index: true,
        follow: true,
        maxImagePreview: "standard",
      },
      openGraph: {
        title: "",
        description: "",
        image: "",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "",
        description: "",
        image: "",
      },
      structuredData: {},
      sitemapInclusion: true,
    },
    status: "draft",
    settings: {
      pageType: "default",
      visibility: "public",
      featured: false,
      allowComments: true,
      template: "default",
      authorId: "current-user-id",
      parentId: undefined,
      isHomepage: false,
    }
  })

  const formatSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-_]/g, "")

  const handleTitleChange = async (title: string) => {
    const newSlug = formatSlug(title)

    setPage(prev => ({ ...prev, title, slug: newSlug }))

    if (!selectedTenantId || !newSlug) return

    const currentId = ++slugCheckId.current
    setSlugValidation(prev => ({ ...prev, isChecking: true }))

    const result = await checkSlugAvailability(newSlug, selectedTenantId)

    if (currentId !== slugCheckId.current) return

    setSlugValidation({
      isValid: result.available,
      message: result.available ? "" : result.message || "This slug is already in use",
      isChecking: false
    })
  }



  const handleSlugChange = async (newSlug: string) => {
    const formattedSlug = formatSlug(newSlug)

    setPage(prev => ({ ...prev, slug: formattedSlug }))

    if (!selectedTenantId || !formattedSlug) return

    const currentId = ++slugCheckId.current
    setSlugValidation(prev => ({ ...prev, isChecking: true }))

    const result = await checkSlugAvailability(formattedSlug, selectedTenantId)

    if (currentId !== slugCheckId.current) return

    setSlugValidation({
      isValid: result.available,
      message: result.available ? "" : result.message || "This slug is already in use",
      isChecking: false
    })
  }



  // Add section to pageTree
  const addSection = (type: SectionType) => {
    const newSection = createSection(type)
    newSection.order = page.pageTree.sections.length

    setPage(prev => ({
      ...prev,
      pageTree: {
        ...prev.pageTree,
        sections: [...prev.pageTree.sections, newSection]
      }
    }))
  }

  // Update content node props (styling/config only)
  const updateContentNodeProps = (sectionId: string, nodeId: string, updates: Record<string, any>) => {
    setPage(prev => {
      const updatedSections = prev.pageTree.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            children: section.children.map(child =>
              child.id === nodeId
                ? { ...child, props: { ...child.props, ...updates } }
                : child
            )
          }
        }
        return section
      })

      return {
        ...prev,
        pageTree: {
          ...prev.pageTree,
          sections: updatedSections
        }
      }
    })
  }

  // Update inline text content (text lives in children[0].props.content)
  const updateInlineTextContent = (sectionId: string, nodeId: string, content: string) => {
    setPage(prev => {
      const updatedSections = prev.pageTree.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            children: section.children.map(child => {
              if (child.id === nodeId && child.children.length > 0) {
                const updatedChildren = [...child.children]
                if (updatedChildren[0].type === 'text') {
                  updatedChildren[0] = {
                    ...updatedChildren[0],
                    props: { ...updatedChildren[0].props, content }
                  }
                } else {
                  // Add text node if missing
                  updatedChildren.unshift(createInlineNode('text', { content }))
                }
                return { ...child, children: updatedChildren }
              }
              return child
            })
          }
        }
        return section
      })

      return {
        ...prev,
        pageTree: {
          ...prev.pageTree,
          sections: updatedSections
        }
      }
    })
  }

  // Get inline text content from node
  const getInlineTextContent = (node: ContentNode): string => {
    const textNode = node.children.find(child => child.type === 'text')
    return textNode?.props.content || ''
  }

  // Add child to section
  const addChildToSection = (sectionId: string, childType: ContentNodeType) => {
    setPage(prev => {
      const updatedSections = prev.pageTree.sections.map(section => {
        if (section.id === sectionId) {
          const newChild = createContentNode(childType)
          return {
            ...section,
            children: [...section.children, newChild]
          }
        }
        return section
      })

      return {
        ...prev,
        pageTree: {
          ...prev.pageTree,
          sections: updatedSections
        }
      }
    })
  }

  // Remove child from section
  const removeChildFromSection = (sectionId: string, childId: string) => {
    setPage(prev => {
      const updatedSections = prev.pageTree.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            children: section.children.filter(child => child.id !== childId)
          }
        }
        return section
      })

      return {
        ...prev,
        pageTree: {
          ...prev.pageTree,
          sections: updatedSections
        }
      }
    })
  }

  // Move section up/down
  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setPage(prev => {
      const sections = [...prev.pageTree.sections]
      const currentIndex = sections.findIndex(s => s.id === sectionId)

      if (direction === 'up' && currentIndex > 0) {
        [sections[currentIndex], sections[currentIndex - 1]] =
          [sections[currentIndex - 1], sections[currentIndex]]

        sections.forEach((section, index) => {
          section.order = index
        })
      } else if (direction === 'down' && currentIndex < sections.length - 1) {
        [sections[currentIndex], sections[currentIndex + 1]] =
          [sections[currentIndex + 1], sections[currentIndex]]

        sections.forEach((section, index) => {
          section.order = index
        })
      }

      return {
        ...prev,
        pageTree: {
          ...prev.pageTree,
          sections
        }
      }
    })
  }

  const handleCreate = async () => {
    if (!slugValidation.isValid) {
      alert("Please fix slug validation errors before creating")
      return
    }

    try {
      const pageData = {
        tenantId: selectedTenantId,
        title: page.title,
        slug: page.slug,
        pageTree: page.pageTree,
        seo: page.seo,
        status: page.status,
        settings: page.settings,
      }

      console.log("CREATE PAGE PAYLOAD:", pageData)

      const createdPage = await createPage(pageData)
      console.log("CREATED PAGE:", createdPage)

      router.push(`/cms/content/pages/${createdPage.pageId}`)
    } catch (error) {
      console.error("Failed to create page:", error)
    }
  }

  // Render content node editor based on type
  const renderContentNodeEditor = (sectionId: string, node: ContentNode) => {
    const textContent = getInlineTextContent(node)

    switch (node.type) {
      case 'heading':
      case 'subheading':
        return (
          <div className="space-y-2">
            <Label className="text-xs">
              {node.type === 'heading' ? 'Heading' : 'Subheading'}
              (Level {node.props.level || (node.type === 'heading' ? 1 : 2)})
            </Label>
            <Input
              value={textContent}
              onChange={(e) => updateInlineTextContent(sectionId, node.id, e.target.value)}
              placeholder={`Enter ${node.type} text`}
            />
            <Select
              value={node.props.level?.toString() || (node.type === 'heading' ? '1' : '2')}
              onValueChange={(value) => updateContentNodeProps(sectionId, node.id, { level: parseInt(value) })}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Heading level" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(level => (
                  <SelectItem key={level} value={level.toString()}>H{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 'paragraph':
      case 'quote':
      case 'question':
      case 'answer':
      case 'caption':
      case 'company':
      case 'personName':
        const labelMap: Record<string, string> = {
          paragraph: 'Paragraph',
          quote: 'Quote',
          question: 'Question',
          answer: 'Answer',
          caption: 'Caption',
          company: 'Company',
          personName: 'Person Name'
        }
        return (
          <div className="space-y-2">
            <Label className="text-xs">{labelMap[node.type] || node.type}</Label>
            <Textarea
              value={textContent}
              onChange={(e) => updateInlineTextContent(sectionId, node.id, e.target.value)}
              placeholder={`Enter ${labelMap[node.type] || node.type} text`}
            />
          </div>
        )
      case 'button':
        return (
          <div className="space-y-2">
            <Label className="text-xs">Button</Label>
            <div className="flex gap-2">
              <Input
                value={textContent}
                onChange={(e) => updateInlineTextContent(sectionId, node.id, e.target.value)}
                placeholder="Button label"
                className="flex-1"
              />
              <Input
                value={node.props.href || '#'}
                onChange={(e) => updateContentNodeProps(sectionId, node.id, { href: e.target.value })}
                placeholder="URL"
                className="flex-1"
              />
            </div>
            <Select
              value={node.props.variant || 'primary'}
              onValueChange={(value) => updateContentNodeProps(sectionId, node.id, { variant: value })}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Button variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case 'link':
        return (
          <div className="space-y-2">
            <Label className="text-xs">Link</Label>
            <div className="flex gap-2">
              <Input
                value={textContent}
                onChange={(e) => updateInlineTextContent(sectionId, node.id, e.target.value)}
                placeholder="Link text"
                className="flex-1"
              />
              <Input
                value={node.props.href || '#'}
                onChange={(e) => updateContentNodeProps(sectionId, node.id, { href: e.target.value })}
                placeholder="URL"
                className="flex-1"
              />
            </div>
          </div>
        )
      case 'image':
      case 'avatarImage':
        return (
          <div className="space-y-2">
            <Label className="text-xs">{node.type === 'avatarImage' ? 'Avatar' : 'Image'}</Label>
            <Input
              value={node.props.src || ''}
              onChange={(e) => updateContentNodeProps(sectionId, node.id, { src: e.target.value })}
              placeholder="Image URL"
            />
            <Input
              value={node.props.alt || ''}
              onChange={(e) => updateContentNodeProps(sectionId, node.id, { alt: e.target.value })}
              placeholder="Alt text"
            />
            {node.type === 'image' && (
              <Select
                value={node.props.alignment || 'left'}
                onValueChange={(value) => updateContentNodeProps(sectionId, node.id, { alignment: value })}
              >
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="Alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )
      case 'video':
        return (
          <div className="space-y-2">
            <Label className="text-xs">Video</Label>
            <Input
              value={node.props.src || ''}
              onChange={(e) => updateContentNodeProps(sectionId, node.id, { src: e.target.value })}
              placeholder="Video URL"
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={node.props.controls || true}
                onCheckedChange={(checked) => updateContentNodeProps(sectionId, node.id, { controls: checked })}
              />
              <Label className="text-xs">Show controls</Label>
            </div>
          </div>
        )
      case 'rating':
        return (
          <div className="space-y-2">
            <Label className="text-xs">Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => updateContentNodeProps(sectionId, node.id, { value: star })}
                  className={`text-2xl ${star <= (node.props.value || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )
      case 'feature':
        return (
          <div className="space-y-2">
            <Label className="text-xs">Feature</Label>
            <Input
              value={textContent}
              onChange={(e) => updateInlineTextContent(sectionId, node.id, e.target.value)}
              placeholder="Feature title"
            />
            <Input
              value={node.props.icon || ''}
              onChange={(e) => updateContentNodeProps(sectionId, node.id, { icon: e.target.value })}
              placeholder="Icon name or URL"
            />
            <Select
              value={node.props.color || 'default'}
              onValueChange={(value) => updateContentNodeProps(sectionId, node.id, { color: value })}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case 'badge':
        return (
          <div className="space-y-2">
            <Label className="text-xs">Badge</Label>
            <Input
              value={textContent}
              onChange={(e) => updateInlineTextContent(sectionId, node.id, e.target.value)}
              placeholder="Badge text"
            />
            <Select
              value={node.props.variant || 'default'}
              onValueChange={(value) => updateContentNodeProps(sectionId, node.id, { variant: value })}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Badge variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case 'icon':
        return (
          <div className="space-y-2">
            <Label className="text-xs">Icon</Label>
            <Input
              value={node.props.name || ''}
              onChange={(e) => updateContentNodeProps(sectionId, node.id, { name: e.target.value })}
              placeholder="Icon name (e.g., 'star', 'check')"
            />
            <Input
              value={node.props.src || ''}
              onChange={(e) => updateContentNodeProps(sectionId, node.id, { src: e.target.value })}
              placeholder="Custom icon URL (optional)"
            />
            <Select
              value={node.props.size || 'md'}
              onValueChange={(value) => updateContentNodeProps(sectionId, node.id, { size: value })}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      default:
        return (
          <div className="text-xs text-muted-foreground">
            {node.type} editor not implemented
          </div>
        )
    }
  }

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
            Create structured CMS pages with inline content
          </p>
        </div>

        <Button
          onClick={handleCreate}
          disabled={!page.title || !selectedTenantId || !slugValidation.isValid}
        >
          <Save className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>

      {/* Validation alert */}
      {!slugValidation.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Slug validation failed: {slugValidation.message}
          </AlertDescription>
        </Alert>
      )}

      {/* PAGE META */}
      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Page Details are only for internal reference.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tenant selection */}
          <div className="space-y-2">
            <Label>Choose Website</Label>
            <Select
              value={selectedTenantId}
              onValueChange={(value) => setSelectedTenantId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a website" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant._id} value={tenant._id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={page.title}
              disabled={!selectedTenantId}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter page title"
            />
          </div>

          {/* Slug */}
          <div>
            <Label>Slug</Label>
            <div className="flex items-center gap-2">
              <Input
                value={page.slug}
                disabled={!selectedTenantId}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="url-slug"
              />
              {slugValidation.isChecking && (
                <span className="text-xs text-muted-foreground">Checking availability...</span>
              )}
            </div>
          </div>

          {/* Page Type and Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageType">
                <Hash className="h-4 w-4 inline mr-2" />
                Page Type
              </Label>
              <Select
                value={page.settings.pageType}
                onValueChange={(value: PageType) =>
                  setPage(prev => ({
                    ...prev,
                    settings: { ...prev.settings, pageType: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Page</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="system">System Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">
                <Shield className="h-4 w-4 inline mr-2" />
                Visibility
              </Label>
              <Select
                value={page.settings.visibility}
                onValueChange={(value: Visibility) =>
                  setPage(prev => ({
                    ...prev,
                    settings: { ...prev.settings, visibility: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="auth-only">Authenticated Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-2">
            <Label>SEO Settings</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Index in Search</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={page.seo.robots.index}
                    onCheckedChange={(checked) =>
                      setPage(prev => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          robots: { ...prev.seo.robots, index: checked }
                        }
                      }))
                    }
                  />
                  <span className="text-sm">
                    {page.seo.robots.index ? "Index" : "Noindex"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Sitemap</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={page.seo.sitemapInclusion}
                    onCheckedChange={(checked) =>
                      setPage(prev => ({
                        ...prev,
                        seo: { ...prev.seo, sitemapInclusion: checked }
                      }))
                    }
                  />
                  <span className="text-sm">
                    {page.seo.sitemapInclusion ? "Include" : "Exclude"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CONTENT BUILDER - Enhanced with inline content */}
      <Card>
        <CardHeader>
          <CardTitle>Content Sections</CardTitle>
          <p className="text-sm text-muted-foreground">
            {page.pageTree.sections.length} sections • All text lives in inline nodes
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {page.pageTree.sections.map((section) => (
            <div
              key={section.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {section.type.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {section.children.length} content nodes
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={section.order === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={section.order === page.pageTree.sections.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => {
                      setPage(prev => ({
                        ...prev,
                        pageTree: {
                          ...prev.pageTree,
                          sections: prev.pageTree.sections
                            .filter(s => s.id !== section.id)
                            .map((s, i) => ({ ...s, order: i }))
                        }
                      }))
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Section Children Editors */}
              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                {section.children.map((child) => (
                  <div key={child.id} className="space-y-2">
                    {renderContentNodeEditor(section.id, child)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive"
                      onClick={() => removeChildFromSection(section.id, child.id)}
                    >
                      Remove {child.type}
                    </Button>
                  </div>
                ))}

                {/* Add Child Button */}
                <div className="pt-2">
                  <Select
                    onValueChange={(value) => addChildToSection(section.id, value as ContentNodeType)}
                  >
                    <SelectTrigger className="text-xs h-8">
                      <SelectValue placeholder="Add content..." />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Global children */}
                      <SelectItem value="heading">Heading</SelectItem>
                      <SelectItem value="paragraph">Paragraph</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="button">Button</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="badge">Badge</SelectItem>
                      <SelectItem value="icon">Icon</SelectItem>

                      {/* Section-specific children */}
                      {section.type === 'hero' && (
                        <>
                          <SelectItem value="subheading">Subheading</SelectItem>
                        </>
                      )}
                      {section.type === 'paragraph' && (
                        <>
                          <SelectItem value="quote">Quote</SelectItem>
                        </>
                      )}
                      {section.type === 'testimonial' && (
                        <>
                          <SelectItem value="quote">Quote</SelectItem>
                          <SelectItem value="personName">Person Name</SelectItem>
                          <SelectItem value="avatarImage">Avatar</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </>
                      )}
                      {section.type === 'cta' && (
                        <>
                          <SelectItem value="badge">Badge</SelectItem>
                        </>
                      )}
                      {section.type === 'features' && (
                        <>
                          <SelectItem value="feature">Feature</SelectItem>
                        </>
                      )}
                      {section.type === 'gallery' && (
                        <>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="caption">Caption</SelectItem>
                        </>
                      )}
                      {section.type === 'faq' && (
                        <>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="answer">Answer</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          {/* ADD SECTIONS */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <h3 className="w-full text-sm font-medium">Add Section</h3>
            {[
              { type: "hero" as SectionType, label: "Hero", icon: "🏆" },
              { type: "paragraph" as SectionType, label: "Paragraph", icon: "📝" },
              { type: "features" as SectionType, label: "Features", icon: "✨" },
              { type: "gallery" as SectionType, label: "Gallery", icon: "🖼️" },
              { type: "cta" as SectionType, label: "CTA", icon: "🎯" },
              { type: "testimonial" as SectionType, label: "Testimonial", icon: "💬" },
              { type: "faq" as SectionType, label: "FAQ", icon: "❓" },
            ].map(({ type, label, icon }) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => addSection(type)}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}