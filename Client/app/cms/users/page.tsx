"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreVertical, Mail, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const users = [
    {
      id: "1",
      name: "Sarah K.",
      email: "sarah@example.com",
      role: "admin",
      status: "active",
      lastActive: "2 hours ago",
      avatar: "SK",
    },
    {
      id: "2",
      name: "Mike R.",
      email: "mike@example.com",
      role: "editor",
      status: "active",
      lastActive: "5 hours ago",
      avatar: "MR",
    },
    {
      id: "3",
      name: "Emma T.",
      email: "emma@example.com",
      role: "author",
      status: "active",
      lastActive: "1 day ago",
      avatar: "ET",
    },
    {
      id: "4",
      name: "John D.",
      email: "john@example.com",
      role: "viewer",
      status: "invited",
      lastActive: "Never",
      avatar: "JD",
    },
  ]

  const roleColors = {
    admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    author: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    viewer: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-pretty text-muted-foreground mt-1">Manage users and their permissions</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Send an invitation to join your team with specific permissions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input id="invite-email" type="email" placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select defaultValue="editor">
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                    <SelectItem value="editor">Editor - Edit content & settings</SelectItem>
                    <SelectItem value="author">Author - Create & edit own content</SelectItem>
                    <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-message">Personal Message (Optional)</Label>
                <Input id="invite-message" placeholder="Welcome to the team!" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsInviteDialogOpen(false)}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">{user.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant="secondary" className={roleColors[user.role as keyof typeof roleColors]}>
                            {user.role}
                          </Badge>
                          {user.status === "invited" && (
                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                          <span>Last active: {user.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>View Activity</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "invited" ? (
                          <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Suspend User</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Role Permissions</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-600">Admin</Badge>
                  <span className="text-sm text-muted-foreground">Full System Access</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Manage all content and users</li>
                  <li>• Configure global settings</li>
                  <li>• Access billing and integrations</li>
                  <li>• Delete website and data</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-600">Editor</Badge>
                  <span className="text-sm text-muted-foreground">Content Management</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Edit all content and pages</li>
                  <li>• Manage media library</li>
                  <li>• Publish and unpublish content</li>
                  <li>• Configure menus and theme</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-600">Author</Badge>
                  <span className="text-sm text-muted-foreground">Content Creation</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Create and edit own content</li>
                  <li>• Upload media files</li>
                  <li>• Submit for review</li>
                  <li>• View published content</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-900">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Viewer</Badge>
                  <span className="text-sm text-muted-foreground">Read Only</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• View all content</li>
                  <li>• Access media library</li>
                  <li>• No editing permissions</li>
                  <li>• No publishing access</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
