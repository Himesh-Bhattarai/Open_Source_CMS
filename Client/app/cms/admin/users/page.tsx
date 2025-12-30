"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Mail, Building2, Calendar } from "lucide-react"
import { useState } from "react"

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const users = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@acmecorp.com",
      website: "ACME Corporation",
      websiteId: "acme-corp",
      status: "active",
      role: "owner",
      joinedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      email: "mike@techstart.com",
      website: "TechStart Inc",
      websiteId: "techstart",
      status: "active",
      role: "owner",
      joinedAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Emily Chen",
      email: "emily@greenearth.com",
      website: "Green Earth Co",
      websiteId: "greenearth",
      status: "trial",
      role: "owner",
      joinedAt: "2024-01-20",
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.website.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
        <p className="text-muted-foreground mt-2">Manage platform users and their websites</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Platform Users
              </CardTitle>
              <CardDescription>Total: {users.length} users</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border hover:border-primary/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {user.website} ({user.websiteId})
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(user.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
