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
import {validateUser} from "@/Api/Settings/services";

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


// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Save, Globe, Mail, Shield, Bell, Database, Code } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// export default function SettingsPage() {
//   const [settings, setSettings] = useState({
//     general: {
//       siteName: "ContentFlow",
//       adminEmail: "admin@contentflow.com",
//       language: "en",
//       timezone: "UTC",
//       dateFormat: "YYYY-MM-DD",
//     },
//     email: {
//       smtpHost: "smtp.example.com",
//       smtpPort: "587",
//       smtpUser: "notifications@contentflow.com",
//       smtpPassword: "••••••••",
//       fromName: "ContentFlow",
//       fromEmail: "noreply@contentflow.com",
//     },
//     security: {
//       twoFactorAuth: false,
//       sessionTimeout: "30",
//       ipWhitelisting: false,
//       passwordMinLength: "8",
//       forcePasswordReset: false,
//     },
//     notifications: {
//       emailNotifications: true,
//       publishNotifications: true,
//       commentNotifications: false,
//       systemAlerts: true,
//     },
//     storage: {
//       provider: "local",
//       maxFileSize: "10",
//       allowedFileTypes: "jpg, png, gif, pdf, doc, docx",
//     },
//     api: {
//       enabled: true,
//       apiKey: "",
//       webhookUrl: "https://api.example.com/webhook",
//       rateLimitEnabled: true,
//       rateLimitRequests: "100",
//     },
//   })

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
//           <p className="text-muted-foreground">Manage your CMS configuration and preferences</p>
//         </div>
//         <Button>
//           <Save className="h-4 w-4 mr-2" />
//           Save All Changes
//         </Button>
//       </div>

//       <Tabs defaultValue="general" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-6">
//           <TabsTrigger value="general">General</TabsTrigger>
//           <TabsTrigger value="email">Email</TabsTrigger>
//           <TabsTrigger value="security">Security</TabsTrigger>
//           <TabsTrigger value="notifications">Notifications</TabsTrigger>
//           <TabsTrigger value="storage">Storage</TabsTrigger>
//           <TabsTrigger value="api">API</TabsTrigger>
//         </TabsList>

//         {/* General Settings */}
//         <TabsContent value="general" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Globe className="h-5 w-5" />
//                 <CardTitle>General Settings</CardTitle>
//               </div>
//               <CardDescription>Basic configuration for your CMS</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="siteName">Site Name</Label>
//                 <Input
//                   id="siteName"
//                   value={settings.general.siteName}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       general: { ...settings.general, siteName: e.target.value },
//                     })
//                   }
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="adminEmail">Administrator Email</Label>
//                 <Input
//                   id="adminEmail"
//                   type="email"
//                   value={settings.general.adminEmail}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       general: { ...settings.general, adminEmail: e.target.value },
//                     })
//                   }
//                 />
//                 <p className="text-xs text-muted-foreground">System notifications will be sent to this address</p>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="language">Language</Label>
//                   <Select
//                     value={settings.general.language}
//                     onValueChange={(value) =>
//                       setSettings({
//                         ...settings,
//                         general: { ...settings.general, language: value },
//                       })
//                     }
//                   >
//                     <SelectTrigger id="language">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="en">English</SelectItem>
//                       <SelectItem value="es">Spanish</SelectItem>
//                       <SelectItem value="fr">French</SelectItem>
//                       <SelectItem value="de">German</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="timezone">Timezone</Label>
//                   <Select
//                     value={settings.general.timezone}
//                     onValueChange={(value) =>
//                       setSettings({
//                         ...settings,
//                         general: { ...settings.general, timezone: value },
//                       })
//                     }
//                   >
//                     <SelectTrigger id="timezone">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="UTC">UTC</SelectItem>
//                       <SelectItem value="America/New_York">Eastern Time</SelectItem>
//                       <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
//                       <SelectItem value="Europe/London">London</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="dateFormat">Date Format</Label>
//                 <Select
//                   value={settings.general.dateFormat}
//                   onValueChange={(value) =>
//                     setSettings({
//                       ...settings,
//                       general: { ...settings.general, dateFormat: value },
//                     })
//                   }
//                 >
//                   <SelectTrigger id="dateFormat">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="YYYY-MM-DD">2024-01-15</SelectItem>
//                     <SelectItem value="MM/DD/YYYY">01/15/2024</SelectItem>
//                     <SelectItem value="DD/MM/YYYY">15/01/2024</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Email Settings */}
//         <TabsContent value="email" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Mail className="h-5 w-5" />
//                 <CardTitle>Email Configuration</CardTitle>
//               </div>
//               <CardDescription>Configure SMTP settings for sending emails</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="smtpHost">SMTP Host</Label>
//                   <Input
//                     id="smtpHost"
//                     value={settings.email.smtpHost}
//                     onChange={(e) =>
//                       setSettings({
//                         ...settings,
//                         email: { ...settings.email, smtpHost: e.target.value },
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="smtpPort">SMTP Port</Label>
//                   <Input
//                     id="smtpPort"
//                     value={settings.email.smtpPort}
//                     onChange={(e) =>
//                       setSettings({
//                         ...settings,
//                         email: { ...settings.email, smtpPort: e.target.value },
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="smtpUser">SMTP Username</Label>
//                 <Input
//                   id="smtpUser"
//                   value={settings.email.smtpUser}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       email: { ...settings.email, smtpUser: e.target.value },
//                     })
//                   }
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="smtpPassword">SMTP Password</Label>
//                 <Input
//                   id="smtpPassword"
//                   type="password"
//                   value={settings.email.smtpPassword}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       email: { ...settings.email, smtpPassword: e.target.value },
//                     })
//                   }
//                 />
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="fromName">From Name</Label>
//                   <Input
//                     id="fromName"
//                     value={settings.email.fromName}
//                     onChange={(e) =>
//                       setSettings({
//                         ...settings,
//                         email: { ...settings.email, fromName: e.target.value },
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="fromEmail">From Email</Label>
//                   <Input
//                     id="fromEmail"
//                     type="email"
//                     value={settings.email.fromEmail}
//                     onChange={(e) =>
//                       setSettings({
//                         ...settings,
//                         email: { ...settings.email, fromEmail: e.target.value },
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <Button variant="outline">Test Email Configuration</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Security Settings */}
//         <TabsContent value="security" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Shield className="h-5 w-5" />
//                 <CardTitle>Security Settings</CardTitle>
//               </div>
//               <CardDescription>Manage security and authentication options</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
//                   <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
//                 </div>
//                 <Switch
//                   id="twoFactor"
//                   checked={settings.security.twoFactorAuth}
//                   onCheckedChange={(checked) =>
//                     setSettings({
//                       ...settings,
//                       security: { ...settings.security, twoFactorAuth: checked },
//                     })
//                   }
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
//                 <Input
//                   id="sessionTimeout"
//                   type="number"
//                   value={settings.security.sessionTimeout}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       security: { ...settings.security, sessionTimeout: e.target.value },
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="ipWhitelist">IP Whitelisting</Label>
//                   <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
//                 </div>
//                 <Switch
//                   id="ipWhitelist"
//                   checked={settings.security.ipWhitelisting}
//                   onCheckedChange={(checked) =>
//                     setSettings({
//                       ...settings,
//                       security: { ...settings.security, ipWhitelisting: checked },
//                     })
//                   }
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="passwordLength">Minimum Password Length</Label>
//                 <Input
//                   id="passwordLength"
//                   type="number"
//                   value={settings.security.passwordMinLength}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       security: { ...settings.security, passwordMinLength: e.target.value },
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="forceReset">Force Password Reset</Label>
//                   <p className="text-sm text-muted-foreground">Require password change every 90 days</p>
//                 </div>
//                 <Switch
//                   id="forceReset"
//                   checked={settings.security.forcePasswordReset}
//                   onCheckedChange={(checked) =>
//                     setSettings({
//                       ...settings,
//                       security: { ...settings.security, forcePasswordReset: checked },
//                     })
//                   }
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Notifications Settings */}
//         <TabsContent value="notifications" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Bell className="h-5 w-5" />
//                 <CardTitle>Notification Preferences</CardTitle>
//               </div>
//               <CardDescription>Control what notifications you receive</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="emailNotif">Email Notifications</Label>
//                   <p className="text-sm text-muted-foreground">Receive notifications via email</p>
//                 </div>
//                 <Switch
//                   id="emailNotif"
//                   checked={settings.notifications.emailNotifications}
//                   onCheckedChange={(checked) =>
//                     setSettings({
//                       ...settings,
//                       notifications: { ...settings.notifications, emailNotifications: checked },
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="publishNotif">Publish Notifications</Label>
//                   <p className="text-sm text-muted-foreground">Notify when content is published</p>
//                 </div>
//                 <Switch
//                   id="publishNotif"
//                   checked={settings.notifications.publishNotifications}
//                   onCheckedChange={(checked) =>
//                     setSettings({
//                       ...settings,
//                       notifications: { ...settings.notifications, publishNotifications: checked },
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="commentNotif">Comment Notifications</Label>
//                   <p className="text-sm text-muted-foreground">Notify when new comments are posted</p>
//                 </div>
//                 <Switch
//                   id="commentNotif"
//                   checked={settings.notifications.commentNotifications}
//                   onCheckedChange={(checked) =>
//                     setSettings({
//                       ...settings,
//                       notifications: { ...settings.notifications, commentNotifications: checked },
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="systemAlerts">System Alerts</Label>
//                   <p className="text-sm text-muted-foreground">Important system notifications</p>
//                 </div>
//                 <Switch
//                   id="systemAlerts"
//                   checked={settings.notifications.systemAlerts}
//                   onCheckedChange={(checked) =>
//                     setSettings({
//                       ...settings,
//                       notifications: { ...settings.notifications, systemAlerts: checked },
//                     })
//                   }
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Storage Settings */}
//         <TabsContent value="storage" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Database className="h-5 w-5" />
//                 <CardTitle>Storage Configuration</CardTitle>
//               </div>
//               <CardDescription>Manage file storage and media settings</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="provider">Storage Provider</Label>
//                 <Select
//                   value={settings.storage.provider}
//                   onValueChange={(value) =>
//                     setSettings({
//                       ...settings,
//                       storage: { ...settings.storage, provider: value },
//                     })
//                   }
//                 >
//                   <SelectTrigger id="provider">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="local">Local Storage</SelectItem>
//                     <SelectItem value="s3">Amazon S3</SelectItem>
//                     <SelectItem value="gcs">Google Cloud Storage</SelectItem>
//                     <SelectItem value="cloudinary">Cloudinary</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="maxSize">Max File Size (MB)</Label>
//                 <Input
//                   id="maxSize"
//                   type="number"
//                   value={settings.storage.maxFileSize}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       storage: { ...settings.storage, maxFileSize: e.target.value },
//                     })
//                   }
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="allowedTypes">Allowed File Types</Label>
//                 <Input
//                   id="allowedTypes"
//                   value={settings.storage.allowedFileTypes}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       storage: { ...settings.storage, allowedFileTypes: e.target.value },
//                     })
//                   }
//                 />
//                 <p className="text-xs text-muted-foreground">Comma-separated file extensions</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* API Settings */}
//         <TabsContent value="api" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Code className="h-5 w-5" />
//                 <CardTitle>API Configuration</CardTitle>
//               </div>
//               <CardDescription>Manage API access and webhooks</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="apiEnabled">API Access</Label>
//                   <p className="text-sm text-muted-foreground">Enable API endpoints</p>
//                 </div>
//                 <Switch
//                   id="apiEnabled"
//                   checked={settings.api.enabled}
//                   onCheckedChange={(checked) =>
//                     setSettings({
//                       ...settings,
//                       api: { ...settings.api, enabled: checked },
//                     })
//                   }
//                 />
//               </div>

//               {settings.api.enabled && (
//                 <>
//                   <div className="space-y-2">
//                     <Label htmlFor="apiKey">API Key</Label>
//                     <div className="flex gap-2">
//                       <Input id="apiKey" type="password" value={settings.api.apiKey} readOnly />
//                       <Button variant="outline">Regenerate</Button>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="webhook">Webhook URL</Label>
//                     <Input
//                       id="webhook"
//                       value={settings.api.webhookUrl}
//                       onChange={(e) =>
//                         setSettings({
//                           ...settings,
//                           api: { ...settings.api, webhookUrl: e.target.value },
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label htmlFor="rateLimit">Rate Limiting</Label>
//                       <p className="text-sm text-muted-foreground">Limit API requests per minute</p>
//                     </div>
//                     <Switch
//                       id="rateLimit"
//                       checked={settings.api.rateLimitEnabled}
//                       onCheckedChange={(checked) =>
//                         setSettings({
//                           ...settings,
//                           api: { ...settings.api, rateLimitEnabled: checked },
//                         })
//                       }
//                     />
//                   </div>

//                   {settings.api.rateLimitEnabled && (
//                     <div className="space-y-2">
//                       <Label htmlFor="rateLimitReq">Requests per Minute</Label>
//                       <Input
//                         id="rateLimitReq"
//                         type="number"
//                         value={settings.api.rateLimitRequests}
//                         onChange={(e) =>
//                           setSettings({
//                             ...settings,
//                             api: { ...settings.api, rateLimitRequests: e.target.value },
//                           })
//                         }
//                       />
//                     </div>
//                   )}
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
