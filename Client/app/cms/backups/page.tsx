"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTenant } from "@/context/TenantContext";
import {
  createBackup,
  downloadBackup,
  getBackups,
  getBackupSettings,
  restoreBackup,
  saveBackupSettings,
} from "@/Api/Backup/Backup";

type Frequency = "daily" | "weekly" | "monthly" | "quarterly" | "annually";

type BackupItem = {
  _id: string;
  name: string;
  type: "manual" | "scheduled" | "automatic";
  status: "scheduled" | "completed" | "failed" | "restored";
  frequency?: Frequency | null;
  runAt: string;
  sizeBytes: number;
  tenantId?: string | null;
  includes: {
    pages: boolean;
    media: boolean;
    settings: boolean;
    database: boolean;
  };
  metadata?: {
    description?: string;
    strategy?: "full" | "incremental";
    validate?: boolean;
  };
  delivery?: {
    annualEmailSentAt?: string | null;
    annualEmailTo?: string;
  };
};

type BackupPolicy = {
  _id: string;
  frequency: Frequency;
  enabled: boolean;
  retentionDays: number;
  nextRunAt: string;
  annualEmailDelivery: boolean;
  includes: {
    pages: boolean;
    media: boolean;
    settings: boolean;
    database: boolean;
  };
};

const frequencyOptions: Frequency[] = ["daily", "weekly", "monthly", "quarterly", "annually"];

const toReadable = (f: string) => `${f.charAt(0).toUpperCase()}${f.slice(1)}`;

const bytesToSize = (bytes: number) => {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
};

export default function BackupsPage() {
  const { tenants, selectedTenantId } = useTenant();

  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [policies, setPolicies] = useState<BackupPolicy[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [scopeMode, setScopeMode] = useState<"all" | "tenant">("all");
  const [tenantScope, setTenantScope] = useState<string>(selectedTenantId || "ALL");

  const [includeFilter, setIncludeFilter] = useState<
    "all-data" | "pages" | "media" | "settings" | "database"
  >("all-data");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "scheduled" | "restored" | "failed"
  >("all");

  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [retention, setRetention] = useState("30");
  const [annualEmailDelivery, setAnnualEmailDelivery] = useState(true);

  const [includes, setIncludes] = useState({
    pages: true,
    media: true,
    settings: true,
    database: true,
  });

  const [backupName, setBackupName] = useState("");
  const [backupDescription, setBackupDescription] = useState("");
  const [backupStrategy, setBackupStrategy] = useState<"full" | "incremental">("full");
  const [validateBackup, setValidateBackup] = useState(false);
  const [scheduleBackup, setScheduleBackup] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");

  const [selectedRestoreId, setSelectedRestoreId] = useState<string | null>(null);
  const [restoreStrategy, setRestoreStrategy] = useState<"replace" | "merge">("replace");

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (selectedTenantId && tenantScope === "ALL") {
      setTenantScope(selectedTenantId);
    }
  }, [selectedTenantId]);

  const activeTenantId = scopeMode === "tenant" && tenantScope !== "ALL" ? tenantScope : "";

  const loadData = async () => {
    setIsLoading(true);

    const [records, settings] = await Promise.all([
      getBackups({
        scope: scopeMode,
        tenantId: activeTenantId,
        include: includeFilter,
        status: statusFilter === "all" ? "" : statusFilter,
      }),
      getBackupSettings(activeTenantId),
    ]);

    if (!records.ok) toast.error(records.message || "Failed to load backups");
    if (!settings.ok) toast.error(settings.message || "Failed to load backup settings");

    setBackups(Array.isArray(records.data) ? records.data : []);
    setPolicies(Array.isArray(settings.data) ? settings.data : []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [scopeMode, activeTenantId, includeFilter, statusFilter]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadData();
    }, 60000);
    return () => clearInterval(timer);
  }, [scopeMode, activeTenantId, includeFilter, statusFilter]);

  useEffect(() => {
    const selectedPolicy = policies.find((p) => p.frequency === frequency);
    if (!selectedPolicy) return;
    setRetention(String(selectedPolicy.retentionDays || 30));
    setAnnualEmailDelivery(!!selectedPolicy.annualEmailDelivery);
    setIncludes(selectedPolicy.includes || includes);
  }, [frequency, policies]);

  const handleSaveSettings = async () => {
    if (scopeMode === "tenant" && !activeTenantId) {
      toast.error("Select a tenant for tenant-scoped backup settings");
      return;
    }

    const res = await saveBackupSettings({
      tenantId: activeTenantId || null,
      frequency,
      retentionDays: Number(retention) || 30,
      includes,
      enabled: true,
      annualEmailDelivery,
      timezone: "UTC",
    });

    if (!res.ok) {
      toast.error(res.message || "Failed to save settings");
      return;
    }

    toast.success(`${toReadable(frequency)} backup schedule saved`);
    await loadData();
  };

  const handleCreateBackup = async () => {
    const payload: any = {
      tenantId: activeTenantId || null,
      type: scheduleBackup ? "scheduled" : "manual",
      strategy: backupStrategy,
      includes,
      name: backupName,
      description: backupDescription,
      validate: validateBackup,
      frequency: scheduleBackup ? frequency : null,
    };

    if (scheduleBackup && scheduledDate && scheduledTime) {
      payload.scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
    }

    const res = await createBackup(payload);
    if (!res.ok) {
      toast.error(res.message || "Failed to create backup");
      return;
    }

    toast.success(scheduleBackup ? "Backup scheduled" : "Backup created");
    setIsCreateOpen(false);
    setBackupName("");
    setBackupDescription("");
    setScheduleBackup(false);
    await loadData();
  };

  const handleDownload = async (id: string) => {
    const res = await downloadBackup(id);
    if (!res.ok) {
      toast.error(res.message || "Failed to download backup");
      return;
    }

    const blob = res.data?.blob;
    const filename = res.data?.filename || `backup_${id}.json`;
    if (!blob) {
      toast.error("Invalid backup download response");
      return;
    }

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);

    toast.success("Backup downloaded");
  };

  const handleRestore = async () => {
    if (!selectedRestoreId) return;

    const res = await restoreBackup({
      backupId: selectedRestoreId,
      strategy: restoreStrategy,
      dryRun: false,
      notify: true,
    });

    if (!res.ok) {
      toast.error(res.message || "Failed to restore backup");
      return;
    }

    toast.success("Backup restored");
    setSelectedRestoreId(null);
    await loadData();
  };

  const stats = useMemo(() => {
    const totalSize = backups.reduce((acc, b) => acc + (b.sizeBytes || 0), 0);
    const latest = backups.length > 0 ? backups[0] : null;
    return { total: backups.length, totalSize, latest };
  }, [backups]);

  const policyMap = useMemo(() => {
    const map = new Map<Frequency, BackupPolicy>();
    policies.forEach((p) => map.set(p.frequency, p));
    return map;
  }, [policies]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backups</h1>
          <p className="text-muted-foreground mt-2">
            Daily, weekly, monthly, quarterly and annual backups
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Backup</DialogTitle>
              <DialogDescription>Run immediately or schedule backup</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name (optional)</Label>
                  <Input value={backupName} onChange={(e) => setBackupName(e.target.value)} />
                </div>
                <div>
                  <Label>Strategy</Label>
                  <Select
                    value={backupStrategy}
                    onValueChange={(v: "full" | "incremental") => setBackupStrategy(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="incremental">Incremental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description (optional)</Label>
                <Input
                  value={backupDescription}
                  onChange={(e) => setBackupDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Include Data</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={includes.pages}
                      onCheckedChange={(v) => setIncludes((p) => ({ ...p, pages: !!v }))}
                    />
                    Pages
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={includes.media}
                      onCheckedChange={(v) => setIncludes((p) => ({ ...p, media: !!v }))}
                    />
                    Media
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={includes.settings}
                      onCheckedChange={(v) => setIncludes((p) => ({ ...p, settings: !!v }))}
                    />
                    Settings
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={includes.database}
                      onCheckedChange={(v) => setIncludes((p) => ({ ...p, database: !!v }))}
                    />
                    Database
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between border rounded p-3">
                <span className="text-sm">Validate backup after creation</span>
                <Switch checked={validateBackup} onCheckedChange={setValidateBackup} />
              </div>

              <div className="flex items-center justify-between border rounded p-3">
                <span className="text-sm">Schedule instead of run now</span>
                <Switch checked={scheduleBackup} onCheckedChange={setScheduleBackup} />
              </div>

              {scheduleBackup && (
                <div className="grid gap-4 sm:grid-cols-3 border rounded p-3">
                  <div>
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={(v: Frequency) => setFrequency(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((f) => (
                          <SelectItem key={f} value={f}>
                            {toReadable(f)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBackup}>
                {scheduleBackup ? "Schedule Backup" : "Create Backup"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Backups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bytesToSize(stats.totalSize)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last Backup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {stats.latest ? new Date(stats.latest.runAt).toLocaleString() : "None"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedules Overview</CardTitle>
          <CardDescription>Daily, weekly, monthly, quarterly and annual schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-5">
            {frequencyOptions.map((f) => {
              const p = policyMap.get(f);
              return (
                <div key={f} className="rounded border p-3">
                  <p className="text-sm font-medium">{toReadable(f)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {p?.enabled ? "Enabled" : "Not configured"}
                  </p>
                  <p className="text-xs mt-2">
                    Next: {p?.nextRunAt ? new Date(p.nextRunAt).toLocaleString() : "-"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Settings</CardTitle>
          <CardDescription>Configure automatic schedule and annual email delivery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Scope</Label>
              <Select value={scopeMode} onValueChange={(v: "all" | "tenant") => setScopeMode(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="tenant">Single Tenant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tenant</Label>
              <Select value={tenantScope} onValueChange={setTenantScope}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Tenants</SelectItem>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant._id} value={tenant._id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v: Frequency) => setFrequency(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((f) => (
                    <SelectItem key={f} value={f}>
                      {toReadable(f)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Retention</Label>
              <Select value={retention} onValueChange={setRetention}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">365 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={includes.pages}
                onCheckedChange={(v) => setIncludes((p) => ({ ...p, pages: !!v }))}
              />
              Pages
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={includes.media}
                onCheckedChange={(v) => setIncludes((p) => ({ ...p, media: !!v }))}
              />
              Media
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={includes.settings}
                onCheckedChange={(v) => setIncludes((p) => ({ ...p, settings: !!v }))}
              />
              Settings
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={includes.database}
                onCheckedChange={(v) => setIncludes((p) => ({ ...p, database: !!v }))}
              />
              Database
            </label>
          </div>

          <div className="flex items-center justify-between border rounded p-3">
            <div>
              <p className="text-sm font-medium">Annual delivery email</p>
              <p className="text-xs text-muted-foreground">
                Send annual backup delivery event to user email after one year cycle
              </p>
            </div>
            <Switch checked={annualEmailDelivery} onCheckedChange={setAnnualEmailDelivery} />
          </div>

          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>Filter and manage backups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Select value={includeFilter} onValueChange={(v: any) => setIncludeFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-data">All Data</SelectItem>
                <SelectItem value="pages">Pages</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="restored">Restored</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadData}>
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading backups...</p>
          ) : backups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No backups found</p>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup._id}
                  className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{backup.name}</p>
                      <Badge variant="outline">{backup.type}</Badge>
                      <Badge
                        variant={
                          backup.status === "completed"
                            ? "default"
                            : backup.status === "scheduled"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {backup.status}
                      </Badge>
                      {backup.frequency && <Badge variant="secondary">{backup.frequency}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {bytesToSize(backup.sizeBytes)} - {new Date(backup.runAt).toLocaleString()}
                    </p>
                    {backup.delivery?.annualEmailSentAt && (
                      <p className="text-xs text-green-700">
                        Annual email sent to {backup.delivery.annualEmailTo} on{" "}
                        {new Date(backup.delivery.annualEmailSentAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDownload(backup._id)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRestoreId(backup._id)}
                      disabled={backup.status === "scheduled"}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedRestoreId}
        onOpenChange={(open) => !open && setSelectedRestoreId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription>Choose restore strategy</DialogDescription>
          </DialogHeader>
          <div>
            <Label>Strategy</Label>
            <Select
              value={restoreStrategy}
              onValueChange={(v: "replace" | "merge") => setRestoreStrategy(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="replace">Replace</SelectItem>
                <SelectItem value="merge">Merge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRestoreId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRestore}>
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
