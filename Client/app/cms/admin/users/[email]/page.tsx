"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Mail, Shield, User as UserIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchAllUsers } from "@/Api/Admin/Fetch"

type AdminUser = {
  _id: string
  email: string
  name: string
  role: string
  status: string
  createdAt?: string
  lastLogin?: string
}

export default function AdminUserDetailPage() {
  const params = useParams<{ email: string }>()
  const userEmail = decodeURIComponent(params?.email || "")
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const response = await fetchAllUsers()
      setUsers(Array.isArray(response?.data) ? response.data : [])
      setLoading(false)
    }
    load()
  }, [])

  const user = useMemo(
    () => users.find((item) => item.email?.toLowerCase() === userEmail.toLowerCase()),
    [users, userEmail],
  )

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading user...</p>
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">User not found.</p>
        <Button variant="outline" asChild>
          <Link href="/cms/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to users
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link href="/cms/admin/users">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to users
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {user.name || "Unnamed User"}
          </CardTitle>
          <CardDescription>User details and account metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>
          <p className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <Badge variant="outline">{user.role || "web-owner"}</Badge>
            <Badge variant={user.status === "active" ? "default" : "secondary"}>
              {user.status || "unknown"}
            </Badge>
          </p>
          <p className="text-muted-foreground">
            Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
          </p>
          <p className="text-muted-foreground">
            Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
