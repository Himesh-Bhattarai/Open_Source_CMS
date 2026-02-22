"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Key,
  Shield,
  Trash2,
  AlertTriangle,
  Mail,
  Save,
  Building2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { deleteAccount } from "@/Api/Settings/delete";
import { useAuth } from "@/hooks/useAuth";
import {
  validateUser,
  feedbackCollector,
  changePassword,
  getApiKeys,
} from "@/Api/Settings/services";

interface UserApiKey {
  _id: string;
  tenantId: string;
  tenantName?: string;
  tenantDomain?: string;
  keyPreview?: string;
  maskedKey?: string;
  permissions?: string[];
  isActive?: boolean;
  name?: string;
  createdAt?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [adminEmail, setAdminEmail] = useState("");

  const [apiKeys, setApiKeys] = useState<UserApiKey[]>([]);
  const [apiLoading, setApiLoading] = useState(false);

  const [rateLimit, setRateLimit] = useState(100);

  const [systemAlerts, setSystemAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [backupEmails, setBackupEmails] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({
    email: "",
    password: "",
  });

  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setAdminEmail(user?.email || "");
  }, [user]);

  const loadApiKeys = async () => {
    setApiLoading(true);
    const response = await getApiKeys();

    if (!response?.ok) {
      toast.error(response?.message || "Failed to load API keys");
      setApiKeys([]);
      setApiLoading(false);
      return;
    }

    setApiKeys(Array.isArray(response.data) ? response.data : []);
    setApiLoading(false);
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const totalKeys = apiKeys.length;
  const activeKeys = useMemo(
    () => apiKeys.filter((key) => key.isActive !== false).length,
    [apiKeys],
  );

  const validateDeleteConfirm = async () => {
    const request = await validateUser(deleteConfirm.email, deleteConfirm.password);

    if (!request?.ok) {
      toast.error(request?.message || "Invalid credentials");
      return false;
    }

    return true;
  };

  const handleCopyApiKey = async (value: string) => {
    if (!value) {
      toast.error("Copy is only available when key material is present");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success("API key copied");
    } catch {
      toast.error("Failed to copy API key");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setPasswordSaving(true);
    const response = await changePassword({
      oldPassword: currentPassword,
      newPassword,
    });
    setPasswordSaving(false);

    if (!response?.ok) {
      toast.error(response?.message || "Failed to change password");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success(response.message || "Password updated successfully");
  };

  const handleDeleteAccount = async () => {
    const isValid = await validateDeleteConfirm();
    if (!isValid) return;

    const response = await deleteAccount();
    if (!response?.ok) {
      toast.error(response?.message || "Failed to delete account");
      return;
    }

    toast.success("Account deleted successfully");
    router.push("/");
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    const response = await feedbackCollector({ message: feedback.trim() });
    if (!response?.ok) {
      toast.error(response?.message || "Failed to send feedback");
      return;
    }

    setFeedback("");
    toast.success("Feedback sent successfully");
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
        <p className="text-muted-foreground">Manage your project settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic configuration for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              disabled
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Keys are loaded by current user and mapped to their tenants.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Total: {totalKeys}</Badge>
            <Badge variant="outline">Active: {activeKeys}</Badge>
            <Button variant="outline" size="sm" onClick={loadApiKeys} disabled={apiLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${apiLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {apiLoading ? (
            <Alert>
              <AlertDescription>Loading API keys...</AlertDescription>
            </Alert>
          ) : null}

          {!apiLoading && totalKeys === 0 ? (
            <Alert>
              <AlertDescription>No API keys found for this user.</AlertDescription>
            </Alert>
          ) : null}

          {!apiLoading && apiKeys.length > 0 ? (
            <div className="space-y-3">
              {apiKeys.map((key) => {
                const displayValue = key.maskedKey || key.keyPreview || "Hidden after creation";
                const copyValue = "";

                return (
                  <div key={key._id} className="rounded-lg border p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={key.isActive === false ? "secondary" : "default"}>
                        {key.isActive === false ? "Inactive" : "Active"}
                      </Badge>
                      <span className="text-sm font-medium">{key.name || "API Key"}</span>
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>Tenant: {key.tenantName || "Unknown Tenant"}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Domain: {key.tenantDomain || "N/A"}
                      </div>
                      <div className="text-muted-foreground">
                        Tenant ID: {key.tenantId || "N/A"}
                      </div>
                      <div className="text-muted-foreground">
                        Created: {key.createdAt ? new Date(key.createdAt).toLocaleString() : "N/A"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input value={displayValue} readOnly className="font-mono" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyApiKey(copyValue)}
                        disabled
                        title="Raw keys are only returned at creation time"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rate-limit">Rate Limit</Label>
              <span className="text-sm text-muted-foreground">requests per minute</span>
            </div>
            <Input
              id="rate-limit"
              type="number"
              value={Number.isNaN(rateLimit) ? 100 : rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value || "100", 10))}
              min={1}
              max={1000}
            />
            <p className="text-sm text-muted-foreground">
              UI only for now. Persist API rate-limit rules from backend when route is ready.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive alerts and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Critical system updates and maintenance
              </p>
            </div>
            <Switch checked={systemAlerts} onCheckedChange={setSystemAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Login attempts and security events</p>
            </div>
            <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Emails</Label>
              <p className="text-sm text-muted-foreground">Daily backup completion reports</p>
            </div>
            <Switch checked={backupEmails} onCheckedChange={setBackupEmails} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Authentication
          </CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Change Password</h4>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleChangePassword} disabled={passwordSaving}>
              <Save className="h-4 w-4 mr-2" />
              {passwordSaving ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Issue or Feedback</CardTitle>
          <CardDescription>Submit bugs, complaints, or suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Describe your issue or feedback</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please describe the issue, bug, or suggestion in detail..."
              rows={4}
            />
          </div>
          <Button onClick={handleSubmitFeedback}>
            <Mail className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Warning: This action cannot be undone. All your data, settings, and content will be
              permanently erased.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="delete-email">Enter your email to confirm</Label>
            <Input
              id="delete-email"
              type="email"
              value={deleteConfirm.email}
              onChange={(e) => setDeleteConfirm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="your-email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delete-password">Enter your password</Label>
            <Input
              id="delete-password"
              type="password"
              value={deleteConfirm.password}
              onChange={(e) => setDeleteConfirm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="********"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirm({ email: "", password: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!deleteConfirm.email || !deleteConfirm.password}
            >
              Delete Account Permanently
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
