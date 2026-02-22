"use client";

import { useEffect, useState } from "react";
import { Plus, Copy } from "lucide-react";
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
import { createTenant } from "@/Api/Tenant/Create-tenant";
import { getUserTenants } from "@/Api/Fetch/allFetch";
import {
  deleteTenantById as deleteTenant,
  editTenantById as updateTenant,
} from "@/Api/Tenant/Services";
import { toast } from "sonner";

interface Tenant {
  _id: string;
  name: string;
  domain: string;
  ownerEmail: string;
}

type TenantLike = Partial<Tenant> & { _id?: string | number };

const normalizeTenants = (value: unknown): Tenant[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((tenant) => tenant as TenantLike)
    .filter((tenant): tenant is TenantLike & { _id: string | number } => tenant._id != null)
    .map((tenant) => ({
      _id: String(tenant._id),
      name: String(tenant.name || ""),
      domain: String(tenant.domain || ""),
      ownerEmail: String(tenant.ownerEmail || ""),
    }));
};

export default function MyWebsitePage() {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);
  const [createdApiKey, setCreatedApiKey] = useState("");
  const [createdTenantName, setCreatedTenantName] = useState("");

  const [form, setForm] = useState({
    name: "",
    domain: "",
    ownerEmail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const data = await getUserTenants();
        setTenants(normalizeTenants(data?.tenants));
      } catch (err) {
        console.error("Failed to fetch tenants", err);
      }
    };

    fetchData();
  }, [user]);

  //edit existing tenant
  const handelEditTenant = async (tenantId: string) => {
    try {
      setLoading(true);

      const response = await updateTenant(tenantId, form);

      if (!response?.ok) {
        toast.error("Failed to update website");
        setLoading(false);
        return;
      }

      const updated = normalizeTenants([response.data])[0];
      if (!updated) {
        toast.error("Invalid website data returned");
        setLoading(false);
        return;
      }

      setTenants((prev) => prev.map((tenant) => (tenant._id === tenantId ? updated : tenant)));

      toast.success("Website updated successfully");
      setForm({ name: "", domain: "", ownerEmail: "" });
      setEditingTenantId(null);
      setIsCreateDialogOpen(false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
      setLoading(false);
    }
  };

  const handleCreateTenant = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await createTenant(form);
      if (!response?.ok) {
        toast.error(response?.message || "Create tenant failed");
        setLoading(false);
        return;
      }
      setCreatedApiKey(response.apiKey || "");
      setCreatedTenantName(response.tenant?.name || form.name || "New website");

      const data = await getUserTenants();
      setTenants(normalizeTenants(data?.tenants));

      setIsCreateDialogOpen(false);
      toast.success("Website created successfully");
      setForm({ name: "", domain: "", ownerEmail: "" });
    } catch (err) {
      console.error("Create tenant failed", err);
      toast.error("Create tenant failed");
    } finally {
      setLoading(false);
    }
  };

  //handel delete
  const handelDelete = async (tenantId: string) => {
    try {
      setLoading(true);
      const response = await deleteTenant(tenantId);
      if (!response?.ok) {
        setLoading(false);
        toast.error("Failed to delete tenant");
        return;
      }
      toast.success("Website deleted successfully");
      setTenants((prevTenants) => prevTenants.filter((tenant) => tenant._id !== tenantId));
      setLoading(false);
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete website.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          {/* Left side: Title */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Website</h1>
            <p className="text-muted-foreground mt-2">Manage your website settings</p>
          </div>
          {/* Right side: Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Website
              </Button>
            </DialogTrigger>
            {/* dialog content stays same */}
          </Dialog>
        </div>

        {createdApiKey && (
          <Card className="border-green-600/50 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-lg">API Key Generated</CardTitle>
              <CardDescription>
                Raw key for <strong>{createdTenantName}</strong>. Copy it now and store securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input value={createdApiKey} readOnly className="font-mono text-xs" />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(createdApiKey);
                      toast.success("API key copied");
                    } catch {
                      toast.error("Failed to copy API key");
                    }
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Key
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCreatedApiKey("");
                    setCreatedTenantName("");
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CREATE WEBSITE BUTTON — ALWAYS VISIBLE */}
        <div className="flex justify-end">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            {/* YOUR EXISTING DIALOG */}
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
                  <Input name="name" value={form.name} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Input name="domain" value={form.domain} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label>Owner Email</Label>
                  <Input name="ownerEmail" value={form.ownerEmail} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label>Created By</Label>
                  <Input value={user?.email || ""} disabled />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingTenantId(null);
                    setForm({ name: "", domain: "", ownerEmail: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingTenantId) {
                      handelEditTenant(editingTenantId);
                    } else {
                      handleCreateTenant();
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingTenantId ? "Update Website" : "Create Website"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* IF NO TENANTS — SHOW EMPTY STATE */}
        {tenants.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No websites yet</p>
          </div>
        )}

        {/* TENANTS */}
        {tenants.map((tenant) => (
          <Card key={tenant._id}>
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
                <p className="text-lg font-medium mt-1">{tenant.name}</p>
              </div>

              <div>
                <Label>Domain</Label>
                <p className="text-lg font-medium mt-1">{tenant.domain}</p>
              </div>

              <div className="flex gap-2">
                <Button asChild>
                  <a
                    href={`https://${tenant.domain}.contentflow.site`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingTenantId(tenant._id);
                    setForm({
                      name: tenant.name || "",
                      domain: tenant.domain || "",
                      ownerEmail: tenant.ownerEmail || "",
                    });
                    setIsCreateDialogOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button variant="destructive" onClick={() => handelDelete(tenant._id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
