"use client";

import { useState , useEffect} from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Key, Shield, Trash2, AlertTriangle, Mail, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/Api/Settings/delete";
import { useAuth } from "@/hooks/useAuth";
import {validateUser} from "@/Api/Settings/service"

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // General Settings
  const [adminEmail, setAdminEmail] = useState("");


  // useEffect to set userEmail
  useEffect(() => {
    if (user?.email) {
      setAdminEmail(user.email);
    }
  }, [user]);

  // API & Limits
  const [apiKey, setApiKey] = useState("sk_live_51NzR2S...");
  const [showApiKey, setShowApiKey] = useState(false);

  const [rateLimit, setRateLimit] = useState(100);
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [regenerateForm, setRegenerateForm] = useState({
    fullName: "",
    email: "",
    note: "Do not share this API key. After generating, you will receive the new API key via email."
  });

  // Notifications
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [backupEmails, setBackupEmails] = useState(false);

  // Backups
  const [enableBackups, setEnableBackups] = useState(true);
  const [frequency, setFrequency] = useState("weekly");
  const [retention, setRetention] = useState("30");
  const [lastBackup, setLastBackup] = useState("2024-01-14 02:00:00 UTC");

  // Security & Auth
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete Account
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    email: "",
    password: ""
  });



  // Feedback & Complaints
  const [feedback, setFeedback] = useState("");

  //Check user password and email is correct to allow delete his account
  const validateDeleteConfirm = ()=>{
    const performValidation = async()=>{
      try{
        const request = await validateUser(deleteConfirm.email, deleteConfirm.password);

        if (!request?.ok && request?.shouting === "!Kill it" ) throw new Error(request?.message);
        setIsDeleteDialogOpen(true);


      }catch(err){
        console.log(err);
      }
    }
    performValidation();
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard");
  };

  const handleRegenerateApiKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 30)}`;
    setApiKey(newKey);
    setIsRegenerateDialogOpen(false);
    setRegenerateForm({
      fullName: "",
      email: "",
      note: "Do not share this API key. After generating, you will receive the new API key via email."
    });
    toast.success("New API key generated and sent to your email");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated successfully");
  };

  const handleDeleteAccount = () => {
    const performDeletion = async () => {
      try {
      const response = await deleteAccount();
        if (!response?.ok) throw new Error("Failed to delete account");
        
        setIsDeleteDialogOpen(false);
        toast.success("Account deleted successfully");
        router.push("/");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    };
    performDeletion();
  };

  const handleSubmitFeedback = () => {
    setFeedback("");
    toast.success("Feedback submitted successfully");
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
        <p className="text-muted-foreground">Manage your project settings and preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic configuration for your project</CardDescription>
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

      {/* API & Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API & Limits
          </CardTitle>
          <CardDescription>Manage API access and rate limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>API Key</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showApiKey ? "Hide" : "Show"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyApiKey}>
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Dialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Regenerate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Regenerate API Key</DialogTitle>
                      <DialogDescription>
                        Request a new API key. The old key will be revoked immediately. This action will revoke your all existing API keys.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          value={regenerateForm.fullName}
                          onChange={(e) => setRegenerateForm({ ...regenerateForm, fullName: e.target.value })}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={regenerateForm.email}
                          onChange={(e) => setRegenerateForm({ ...regenerateForm, email: e.target.value })}
                          placeholder="Your email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Note</Label>
                        <Textarea
                          value={regenerateForm.note}
                          onChange={(e) => setRegenerateForm({ ...regenerateForm, note: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Warning: Regenerating will invalidate your current API key. All applications using this key will stop working.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleRegenerateApiKey}>
                        Regenerate & Send via Email
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={showApiKey ? apiKey : "•".repeat(apiKey.length)}
                readOnly
                className="font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rate-limit">Rate Limit</Label>
              <span className="text-sm text-muted-foreground">requests per minute</span>
            </div>
            <Input
              id="rate-limit"
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value))}
              min={1}
              max={1000}
            />
            <p className="text-sm text-muted-foreground">Applied within platform limits. This rate limit will apply for all your api's and integrations</p>
          </div>

          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              API Key Rules: This key provides full access to your data. Do not share publicly. Use environment variables in production.
              Rotate keys every 90 days. Monitor usage in the analytics dashboard.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive alerts and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Alerts</Label>
              <p className="text-sm text-muted-foreground">Critical system updates and maintenance</p>
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

      {/* Backups */}
      <Card>
        <CardHeader>
          <CardTitle>Backups</CardTitle>
          <CardDescription>Configure automated backup settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Automated Backups</Label>
              <p className="text-sm text-muted-foreground">Automatically backup your data</p>
            </div>
            <Switch checked={enableBackups} onCheckedChange={setEnableBackups} />
          </div>

          {enableBackups && (
            <>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Retention Period</Label>
                <Select value={retention} onValueChange={setRetention}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select retention" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Last Backup</p>
                    <p className="text-sm text-muted-foreground">{lastBackup}</p>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-green-800 text-sm">
                    Completed
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Security & Authentication */}
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
            <Button onClick={handleChangePassword}>
              <Save className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Feedback & Complaints */}
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

      {/* Delete Account */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Warning: This action cannot be undone. All your data, settings, and content will be permanently erased.
            </AlertDescription>
          </Alert>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-4">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  If you delete your account, all your data will be permanently erased and cannot be recovered.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-email">Enter your email to confirm</Label>
                  <Input
                    id="delete-email"
                    type="email"
                    value={deleteConfirm.email}
                    onChange={(e) => setDeleteConfirm({ ...deleteConfirm, email: e.target.value })}
                    placeholder="your-email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delete-password">Enter your password</Label>
                  <Input
                    id="delete-password"
                    type="password"
                    value={deleteConfirm.password}
                    onChange={(e) => setDeleteConfirm({ ...deleteConfirm, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This will immediately delete all your data including content, media, settings, and API keys.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={!deleteConfirm.email || !deleteConfirm.password}
                >
                  Delete Account Permanently
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
