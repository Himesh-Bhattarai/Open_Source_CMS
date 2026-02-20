"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Edit, Eye, Trash2, Copy, CheckSquare, Square } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdvancedSearch } from "@/components/cms/advanced-search"
import { getUserPages } from "@/Api/Page/Fetch"
import { deleteUserPageById } from "@/Api/Page/Services"
import { toast } from "sonner"

interface Page {
  id: string
  title: string
  path: string
  status: string
  lastEdited: string
  author: string
}

export default function PagesPage() {
  const searchParams = useSearchParams()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [authorFilter, setAuthorFilter] = useState("all")
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const redirectedMessage = searchParams.get("message")
    if (redirectedMessage) {
      toast.success(redirectedMessage)
    }
  }, [searchParams])

  // =========================
  // FETCH & NORMALIZE
  // =========================
  useEffect(() => {
    const loadUserPages = async () => {
      try {
        const apiPages = await getUserPages()

        // backend returns ARRAY
        if (!Array.isArray(apiPages)) {
          console.error("API did not return array:", apiPages)
          return
        }

        const normalized: Page[] = apiPages.map((p: any) => ({
          id: String(p._id || p.id || ""),
          title: p.title,
          path: "/" + p.slug,
          status: p.status,
          lastEdited: new Date(p.updatedAt).toLocaleString(),
          author: p.authorId || "Unknown",
        }))
        setPages(normalized)
      } catch (err) {
        console.error("Failed to load pages", err)
      } finally {
        setLoading(false)
      }
    }

    loadUserPages()
  }, [])

  // =========================
  // FILTERING
  // =========================
  const authors = Array.from(new Set(pages.map((p) => p.author)))

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      searchQuery === "" ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || page.status === statusFilter
    const matchesAuthor = authorFilter === "all" || page.author === authorFilter

    return matchesSearch && matchesStatus && matchesAuthor
  })

  // =========================
  // SELECTION
  // =========================
  const handleSelectAll = () => {
    if (selectedPages.size === filteredPages.length) {
      setSelectedPages(new Set())
    } else {
      setSelectedPages(new Set(filteredPages.map((p) => p.id)))
    }
  }

  const handleSelectPage = (id: string) => {
    const copy = new Set(selectedPages)
    copy.has(id) ? copy.delete(id) : copy.add(id)
    setSelectedPages(copy)
  }

  const handleDelete = async (id: string) => {
    try {
      const deletePage = await deleteUserPageById(id);

      if (deletePage?.ok) {
        setPages((prevPages) => prevPages.filter((page) => page.id !== id));
        toast.success("Page deleted successfully.")
      } else {
        toast.error("Failed to delete page.")
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("An error occurred while deleting the page.")
    }
  }

  const handlePreview = (page: Page) => {
    window.open(page.path, "_blank")
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pages</h1>

        <Button asChild>
          <Link href="/cms/content/pages/new">
            <Plus className="h-4 w-4 mr-2" /> New Page
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search pages…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {authors.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AdvancedSearch />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="p-10 text-center">Loading pages…</div>
          ) : filteredPages.length === 0 ? (
            <div className="p-10 text-center">No pages found</div>
          ) : (
            filteredPages.map((page) => (
              <div key={page.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <button onClick={() => handleSelectPage(page.id)}>
                  {selectedPages.has(page.id) ? <CheckSquare /> : <Square />}
                </button>

                <div className="flex-1">
                  <div className="font-medium">{page.title}</div>
                  <div className="text-sm text-muted-foreground">{page.path}</div>
                </div>

                <Badge>{page.status}</Badge>

                <div className="w-40 text-sm text-muted-foreground">
                  {page.lastEdited}
                </div>

                <Button asChild size="sm" variant="outline">
                  <Link href={page.id ? `/cms/content/pages/${page.id}` : "/cms/content/pages"}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost"><MoreVertical /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePreview(page)}>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(page.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
