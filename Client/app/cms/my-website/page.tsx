"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Globe } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createTenant } from "@/Api/Tenant/Create-tenant";

export default function MyWebsitePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [websiteName, setWebsiteName] = useState("")
  const [domain, setDomain] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasWebsite = user?.tenantId


  const [form, setForm] = useState({
    name: "",
    domain: "",
    apiKey: "",
    ownerEmail: "",
  });

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
        createdBy: user.id, // 🔐 enforced by backend too
      });

      setIsCreateDialogOpen(false);
      setForm({ name: "", domain: "", apiKey: "", ownerEmail: "" });
    } catch (err) {
      console.error("Create tenant failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (hasWebsite) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Website</h1>
          <p className="text-muted-foreground mt-2">Manage your website settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Website Active
            </CardTitle>
            <CardDescription>Your website is live and ready to manage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Website Name</Label>
              <p className="text-lg font-medium mt-1">{user?.tenantName}</p>
            </div>
            <div>
              <Label>Domain</Label>
              <p className="text-lg font-medium mt-1">{user?.tenantId}.contentflow.site</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <a href={`https://${user?.tenantId}.contentflow.site`} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </Button>
              <Button variant="outline">Edit Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>

    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <Building2 className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Create Your Website</h1>
        <p className="text-muted-foreground mt-2">Set up your website in just a few steps</p>
      </div>
      </div>

      <div className="flex justify-center mt-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Website
            </Button>
          </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
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
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button  onClick={handleCreateTenant} disabled={loading}>
            {loading ? "Creating..." : "Create Website"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      </div>
    </>
     
  
  )
}
