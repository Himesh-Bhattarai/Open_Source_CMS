"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Globe, Plus, Search, Settings, ExternalLink, MoreVertical, Users, FileText } from "lucide-react"
import Link from "next/link"
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
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { createTenant } from "@/Api/Tenant/Create-tenant"

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: "", domain: "", apiKey: "", ownerEmail: "" })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()


  const { startImpersonation } = useAuth()
  const router = useRouter()

  const tenants = [
    {
      id: "tenant-1",
      name: "Acme Corporation",
      domain: "acme.example.com",
      status: "active",
      plan: "Professional",
      pages: 24,
      users: 8,
      storage: "2.4 GB",
      createdAt: "Jan 15, 2025",
    },
    {
      id: "tenant-2",
      name: "TechStart Inc",
      domain: "techstart.example.com",
      status: "active",
      plan: "Enterprise",
      pages: 156,
      users: 25,
      storage: "8.9 GB",
      createdAt: "Dec 10, 2024",
    },
    {
      id: "tenant-3",
      name: "Creative Studio",
      domain: "creative.example.com",
      status: "trial",
      plan: "Trial",
      pages: 5,
      users: 2,
      storage: "0.3 GB",
      createdAt: "Jan 20, 2025",
    },
  ]

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewAsTenant = (tenantId: string, tenantName: string) => {
    startImpersonation(tenantId, tenantName)
    router.push("/cms")
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTenant = async () => {
    if (!user) return;

    setLoading(true);

    try {
      await createTenant({
        ...form,
        createdBy: user.id,
      });

      setIsCreateDialogOpen(false);
      setForm({ name: "", domain: "", apiKey: "", ownerEmail: "" });
    } catch (err) {
      console.error("Create tenant failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Websites</h1>
          <p className="text-pretty text-muted-foreground mt-1">Manage all your tenant websites and their content</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Website
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Create New Website</DialogTitle>
              <DialogDescription>
                Set up a new tenant website with isolated content and users.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Website Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Acme Corporation"
                />
              </div>

              <div className="space-y-2">
                <Label>Domain</Label>
                <Input
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  placeholder="acme.com"
                />
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  name="apiKey"
                  value={form.apiKey}
                  onChange={handleChange}
                  placeholder="auto-generated or custom"
                />
              </div>

              <div className="space-y-2">
                <Label>Owner Email</Label>
                <Input
                  name="ownerEmail"
                  value={form.ownerEmail}
                  onChange={handleChange}
                  placeholder="owner@acme.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Created By</Label>
                <Input
                  value={user?._id || "undefined"}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTenant} disabled={loading}>
                {loading ? "Creating..." : "Create Website"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{tenant.name}</h3>
                          <Badge
                            variant={tenant.status === "active" ? "default" : "secondary"}
                            className={
                              tenant.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            }
                          >
                            {tenant.status}
                          </Badge>
                          <Badge variant="outline">{tenant.plan}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <ExternalLink className="h-3 w-3" />
                          <span>{tenant.domain}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <FileText className="h-3 w-3" />
                              <span>Pages</span>
                            </div>
                            <div className="font-medium">{tenant.pages}</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Users className="h-3 w-3" />
                              <span>Users</span>
                            </div>
                            <div className="font-medium">{tenant.users}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Storage</div>
                            <div className="font-medium">{tenant.storage}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Created</div>
                            <div className="font-medium">{tenant.createdAt}</div>
                          </div>
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
                        <DropdownMenuItem onClick={() => handleViewAsTenant(tenant.id, tenant.name)}>
                          <Users className="h-4 w-4 mr-2" />
                          View As Owner
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/cms/tenants/${tenant.id}`}>
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Content
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Website</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
