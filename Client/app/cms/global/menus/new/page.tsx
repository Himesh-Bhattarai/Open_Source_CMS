"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewMenuPage() {
  const router = useRouter()
  const [menuName, setMenuName] = useState("")
  const [menuDescription, setMenuDescription] = useState("")
  const [menuLocation, setMenuLocation] = useState("")

  const handleCreate = () => {
    console.log("[v0] Creating new menu:", { menuName, menuDescription, menuLocation })
    // In real app: save to database
    router.push("/cms/global/menus")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cms/global/menus">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Menu</h1>
          <p className="text-muted-foreground">Set up a new navigation menu for your website</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="menu-name">Menu Name *</Label>
            <Input
              id="menu-name"
              placeholder="Main Navigation"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Internal name for identifying this menu</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu-description">Description</Label>
            <Textarea
              id="menu-description"
              placeholder="Describe where this menu will be used..."
              value={menuDescription}
              onChange={(e) => setMenuDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu-location">Menu Location</Label>
            <select
              id="menu-location"
              value={menuLocation}
              onChange={(e) => setMenuLocation(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select location...</option>
              <option value="header">Header Navigation</option>
              <option value="footer">Footer Menu</option>
              <option value="mobile">Mobile Menu</option>
              <option value="sidebar">Sidebar Navigation</option>
              <option value="custom">Custom Location</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link href="/cms/global/menus">Cancel</Link>
            </Button>
            <Button onClick={handleCreate} disabled={!menuName.trim()}>
              Create Menu
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            After creating the menu, you'll be able to add menu items, create sub-menus, and configure the menu
            structure.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
