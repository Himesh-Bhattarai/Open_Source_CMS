import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Eye, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function MenusPage() {
  const menus = [
    {
      id: "main-nav",
      name: "Main Navigation",
      itemCount: 6,
      status: "published",
      lastEdited: "2 hours ago",
      usedIn: ["Header (Desktop)", "Mobile Menu"],
    },
    {
      id: "footer-links",
      name: "Footer Links",
      itemCount: 4,
      status: "draft",
      lastEdited: "5 hours ago",
      usedIn: ["Footer (All pages)"],
    },
    {
      id: "legal-menu",
      name: "Legal Menu",
      itemCount: 3,
      status: "published",
      lastEdited: "3 days ago",
      usedIn: ["Footer (Legal section)"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Menus</h1>
          <p className="text-pretty text-muted-foreground mt-1">Manage site navigation and menu structures</p>
        </div>
        <Button asChild>
          <Link href="/cms/global/menus/new">
            <Plus className="h-4 w-4 mr-2" />
            New Menu
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu) => (
          <Card key={menu.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{menu.itemCount}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{menu.name}</CardTitle>
                    <CardDescription className="text-xs">{menu.itemCount} items</CardDescription>
                  </div>
                </div>
                <Badge variant={menu.status === "published" ? "default" : "secondary"}>{menu.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last edited {menu.lastEdited}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mt-0.5" />
                  <div>
                    <p className="font-medium text-xs text-foreground mb-1">Used in:</p>
                    {menu.usedIn.map((location, idx) => (
                      <p key={idx} className="text-xs">
                        {location}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Link href={`/cms/global/menus/${menu.id}`}>
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
