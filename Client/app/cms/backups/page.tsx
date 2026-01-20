"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Download,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  User,
  Calendar,
  Shield,
  FileCheck,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

// Mock tenants data - in real app, this would come from API
const mockTenants = [
  { id: "tenant-1", name: "Acme Corp" },
  { id: "tenant-2", name: "Globex Inc" },
  { id: "tenant-3", name: "Soylent Corp" },
];

interface Backup {
  id: number;
  name: string;
  type: string;
  size: string;
  status: string;
  date: string;
  includes: string[];
  // New optional fields for enhanced metadata
  metadata?: {
    name?: string;
    description?: string;
    strategy?: string;
    validate?: boolean;
    scheduledAt?: string;
  };
}

interface CreateBackupPayload {
  version: "v1";

  scope: {
    tenantId?: string | null;
    accountId: string;
  };

  type: "manual" | "scheduled";

  strategy: "full" | "incremental";

  includes: {
    pages: boolean;
    media: boolean;
    settings: boolean;
    database: boolean;
  };

  schedule?: {
    runAt: string; // ISO
    timezone: string;
  };

  validation: {
    enabled: boolean;
  };

  metadata: {
    name?: string;
    description?: string;
    triggeredBy: "user" | "system";
    source: "cms-ui";
  };
}

interface RestoreBackupPayload {
  version: "v1";

  backupId: string;

  strategy: "replace" | "merge";

  mode: {
    dryRun: boolean;
  };

  notification: {
    enabled: boolean;
  };

  metadata: {
    triggeredBy: "user";
    source: "cms-ui";
  };
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: 1,
      name: "Full Backup - Jan 20, 2025",
      type: "automatic",
      size: "2.4 GB",
      status: "completed",
      date: "2025-01-20 02:00:00",
      includes: ["Pages", "Media", "Settings", "Database"],
    },
    {
      id: 2,
      name: "Manual Backup - Before Theme Update",
      type: "manual",
      size: "1.8 GB",
      status: "completed",
      date: "2025-01-19 14:30:00",
      includes: ["Pages", "Settings"],
    },
    {
      id: 3,
      name: "Full Backup - Jan 19, 2025",
      type: "automatic",
      size: "2.3 GB",
      status: "completed",
      date: "2025-01-19 02:00:00",
      includes: ["Pages", "Media", "Settings", "Database"],
    },
  ]);

  const [frequency, setFrequency] = useState("daily");
  const [retention, setRetention] = useState("30");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  // Existing state - KEEP AS IS
  const [backupIncludes, setBackupIncludes] = useState({
    pages: true,
    media: true,
    settings: true,
    database: true,
  });

  // NEW: Enhanced state for new features
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [backupName, setBackupName] = useState("");
  const [backupDescription, setBackupDescription] = useState("");
  const [backupStrategy, setBackupStrategy] = useState<"full" | "incremental">(
    "full",
  );
  const [validateBackup, setValidateBackup] = useState(false);
  const [scheduleBackup, setScheduleBackup] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // NEW: Enhanced restore options
  const [restoreStrategy, setRestoreStrategy] = useState<"merge" | "replace">(
    "replace",
  );
  const [dryRunRestore, setDryRunRestore] = useState(false);
  const [notifyOnComplete, setNotifyOnComplete] = useState(false);

  // Initialize scheduled date/time
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setScheduledDate(tomorrow.toISOString().split("T")[0]);
    setScheduledTime("09:00");
  }, []);

  // NEW: Enhanced backup creation with optional fields
  const handleCreateBackup = () => {
    // Prepare payload with optional fields
    const payload: any = {
      include: backupIncludes,
      meta: {
        source: "cms-ui",
        triggeredBy: "user",
        timestamp: new Date().toISOString(),
        // Optional metadata fields
        ...(backupName && { name: backupName }),
        ...(backupDescription && { description: backupDescription }),
      },
    };

    // Optional tenant scope
    if (selectedTenant) {
      payload.tenantId = selectedTenant;
    }

    // Optional backup strategy
    if (backupStrategy) {
      payload.strategy = backupStrategy;
    }

    // Optional validation
    if (validateBackup) {
      payload.validate = true;
    }

    // Optional scheduling
    if (scheduleBackup && scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (scheduledDateTime > new Date()) {
        payload.scheduledAt = scheduledDateTime.toISOString();
      }
    }

    console.log("[v1] Enhanced backup payload:", payload);

    // Call existing API (unchanged signature)
    // requestBackup(payload) - Would be called here

    // Create new backup for UI
    const newBackup: Backup = {
      id: Date.now(),
      name: backupName || `Manual Backup - ${new Date().toLocaleString()}`,
      type: scheduleBackup ? "scheduled" : "manual",
      size: "1.2 GB",
      status: scheduleBackup ? "scheduled" : "completed",
      date: new Date().toISOString(),
      includes: Object.keys(backupIncludes).filter(
        (k) => backupIncludes[k as keyof typeof backupIncludes],
      ),
      metadata: {
        name: backupName || undefined,
        description: backupDescription || undefined,
        strategy: backupStrategy,
        validate: validateBackup,
        ...(scheduleBackup &&
          scheduledDate &&
          scheduledTime && {
            scheduledAt: new Date(
              `${scheduledDate}T${scheduledTime}`,
            ).toISOString(),
          }),
      },
    };

    setBackups([newBackup, ...backups]);

    // Reset enhanced form fields (keep existing ones)
    setBackupName("");
    setBackupDescription("");
    setBackupStrategy("full");
    setValidateBackup(false);
    setScheduleBackup(false);
    setSelectedTenant("");

    setIsCreateDialogOpen(false);
    alert("Backup created successfully!");
  };

  // NEW: Enhanced restore function
  const handleRestore = () => {
    if (selectedBackup) {
      const payload: any = {
        backupId: selectedBackup.id,
        // Optional enhanced restore fields
        strategy: restoreStrategy,
        dryRun: dryRunRestore,
        notify: notifyOnComplete,
        meta: {
          source: "cms-ui",
          triggeredBy: "user",
          timestamp: new Date().toISOString(),
        },
      };

      console.log("[v1] Enhanced restore payload:", payload);
      // Call existing API (unchanged signature)
      // restoreBackup(payload) - Would be called here

      alert(
        `Restoring backup: ${selectedBackup.name}\nStrategy: ${restoreStrategy}\nDry Run: ${dryRunRestore}`,
      );
      setIsRestoreDialogOpen(false);
      setSelectedBackup(null);
      setRestoreStrategy("replace");
      setDryRunRestore(false);
      setNotifyOnComplete(false);
    }
  };

  // NEW: Enhanced download function
  const handleDownload = (backup: Backup) => {
    const payload: any = {
      backupId: backup.id,
      // Optional enhanced download fields
      format: "zip",
      includeLogs: true,
      meta: {
        source: "cms-ui",
        triggeredBy: "user",
        timestamp: new Date().toISOString(),
      },
    };

    console.log("[v1] Enhanced download payload:", payload);
    // Call existing API (unchanged signature)
    // downloadBackup(payload) - Would be called here

    alert(`Downloading: ${backup.name}`);
  };

  const saveSettings = () => {
    console.log("[v0] Saving backup settings:", { frequency, retention });
    alert("Backup settings saved!");
  };

  // NEW: Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backups</h1>
          <p className="text-muted-foreground mt-2">
            Backup and restore your website data
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Manual Backup</DialogTitle>
              <DialogDescription>
                Select what to include in your backup
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
              {/* NEW: Tenant Selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Label htmlFor="tenant">Tenant Scope (Optional)</Label>
                </div>
                <Select
                  value={selectedTenant ?? "ALL"}
                  onValueChange={(v) => {
                    if (v !== null) {
                      setSelectedTenant(v === "ALL" ? null! : v);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Tenants (Full Account)" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ALL">
                      All Tenants (Full Account)
                    </SelectItem>

                    {mockTenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  {selectedTenant
                    ? "Backup will be scoped to selected tenant"
                    : "Backup will include all tenant data"}
                </p>
              </div>

              {/* Existing Content Selection */}
              <div className="space-y-4 py-4 border-t">
                <h4 className="font-medium">Content to Include</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pages"
                      checked={backupIncludes.pages}
                      onCheckedChange={(checked) =>
                        setBackupIncludes({
                          ...backupIncludes,
                          pages: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="pages">Pages & Content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="media"
                      checked={backupIncludes.media}
                      onCheckedChange={(checked) =>
                        setBackupIncludes({
                          ...backupIncludes,
                          media: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="media">Media Library</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="settings"
                      checked={backupIncludes.settings}
                      onCheckedChange={(checked) =>
                        setBackupIncludes({
                          ...backupIncludes,
                          settings: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="settings">Settings & Configuration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="database"
                      checked={backupIncludes.database}
                      onCheckedChange={(checked) =>
                        setBackupIncludes({
                          ...backupIncludes,
                          database: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="database">Database</Label>
                  </div>
                </div>
              </div>

              {/* NEW: Backup Strategy */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <Label>Backup Strategy</Label>
                </div>
                <RadioGroup
                  value={backupStrategy}
                  onValueChange={(value: "full" | "incremental") =>
                    setBackupStrategy(value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="cursor-pointer">
                      Full Backup (Recommended)
                      <p className="text-xs text-muted-foreground font-normal">
                        Complete backup of all selected data
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="incremental" id="incremental" />
                    <Label htmlFor="incremental" className="cursor-pointer">
                      Incremental Backup
                      <p className="text-xs text-muted-foreground font-normal">
                        Only changes since last backup (faster)
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* NEW: Backup Metadata */}
              <div className="space-y-3 border-t pt-4">
                <Label htmlFor="backupName">Backup Name (Optional)</Label>
                <Input
                  id="backupName"
                  placeholder="e.g., 'Before Theme Update'"
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                />

                <Label htmlFor="backupDescription">
                  Description (Optional)
                </Label>
                <Textarea
                  id="backupDescription"
                  placeholder="Add any notes about this backup..."
                  value={backupDescription}
                  onChange={(e) => setBackupDescription(e.target.value)}
                  rows={2}
                />
              </div>

              {/* NEW: Validation Option */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    <Label htmlFor="validate">Validate Backup</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Verify backup integrity after creation
                  </p>
                </div>
                <Switch
                  id="validate"
                  checked={validateBackup}
                  onCheckedChange={setValidateBackup}
                />
              </div>

              {/* NEW: Schedule Backup */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <Label htmlFor="schedule">Schedule Backup</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Run backup at a later time
                  </p>
                </div>
                <Switch
                  id="schedule"
                  checked={scheduleBackup}
                  onCheckedChange={setScheduleBackup}
                />
              </div>

              {scheduleBackup && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateBackup}>
                {scheduleBackup ? "Schedule Backup" : "Create Backup"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Stats Cards - UNCHANGED */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Backups
            </CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Storage Used
            </CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.7 GB</div>
            <p className="text-xs text-muted-foreground mt-1">23% of quota</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Backup
            </CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12h</div>
            <p className="text-xs text-muted-foreground mt-1">ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Existing Settings Card - UNCHANGED */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Backup Settings</CardTitle>
              <CardDescription>Configure automatic backups</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Backup Frequency
              </label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Retention Period
              </label>
              <Select value={retention} onValueChange={setRetention}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="outline" onClick={saveSettings}>
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>
            Download or restore from previous backups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      backup.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : backup.status === "scheduled"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {backup.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : backup.status === "scheduled" ? (
                      <Calendar className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-medium">{backup.name}</h3>
                      <Badge
                        variant={
                          backup.type === "automatic"
                            ? "secondary"
                            : backup.type === "scheduled"
                              ? "default"
                              : "default"
                        }
                      >
                        {backup.type}
                      </Badge>
                      {/* NEW: Show metadata badges */}
                      {backup.metadata?.strategy && (
                        <Badge variant="outline" className="text-xs">
                          {backup.metadata.strategy}
                        </Badge>
                      )}
                      {backup.metadata?.validate && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50"
                        >
                          Validated
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {backup.size} • {formatDate(backup.date)}
                      {backup.metadata?.scheduledAt && (
                        <span className="ml-2 text-blue-600">
                          Scheduled for{" "}
                          {formatDate(backup.metadata.scheduledAt)}
                        </span>
                      )}
                    </p>
                    {/* NEW: Show description if available */}
                    {backup.metadata?.description && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        {backup.metadata.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {backup.includes.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(backup)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Dialog
                    open={isRestoreDialogOpen}
                    onOpenChange={setIsRestoreDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBackup(backup)}
                        disabled={backup.status === "scheduled"}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Restore Backup</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to restore this backup?
                        </DialogDescription>
                      </DialogHeader>
                      {selectedBackup && (
                        <div className="space-y-4 py-4">
                          <div>
                            <p className="font-medium">{selectedBackup.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(selectedBackup.date)}
                            </p>
                          </div>

                          {/* NEW: Enhanced restore options */}
                          <div className="space-y-4 border-t pt-4">
                            <div>
                              <Label className="text-sm font-medium">
                                Restore Strategy
                              </Label>
                              <RadioGroup
                                value={restoreStrategy}
                                onValueChange={(value: "merge" | "replace") =>
                                  setRestoreStrategy(value)
                                }
                                className="mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="replace"
                                    id="replace"
                                  />
                                  <Label
                                    htmlFor="replace"
                                    className="cursor-pointer text-sm"
                                  >
                                    Replace existing data
                                    <p className="text-xs text-muted-foreground font-normal">
                                      Overwrites current data with backup
                                    </p>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="merge" id="merge" />
                                  <Label
                                    htmlFor="merge"
                                    className="cursor-pointer text-sm"
                                  >
                                    Merge with existing data
                                    <p className="text-xs text-muted-foreground font-normal">
                                      Adds backup data without removing current
                                      data
                                    </p>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label
                                  htmlFor="dry-run"
                                  className="text-sm font-normal"
                                >
                                  Dry Run
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Simulate restore without making changes
                                </p>
                              </div>
                              <Switch
                                id="dry-run"
                                checked={dryRunRestore}
                                onCheckedChange={setDryRunRestore}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label
                                  htmlFor="notify"
                                  className="text-sm font-normal"
                                >
                                  Notify on Completion
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Send notification when restore completes
                                </p>
                              </div>
                              <Switch
                                id="notify"
                                checked={notifyOnComplete}
                                onCheckedChange={setNotifyOnComplete}
                              />
                            </div>
                          </div>

                          {dryRunRestore && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                              Dry run enabled: No changes will be made to your
                              data
                            </div>
                          )}
                        </div>
                      )}
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsRestoreDialogOpen(false)}
                          className="sm:flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleRestore}
                          className="sm:flex-1"
                        >
                          {dryRunRestore ? "Dry Run Restore" : "Restore Backup"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
