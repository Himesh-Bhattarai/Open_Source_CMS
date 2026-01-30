"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Copy, Eye, EyeOff, Save } from "lucide-react";

export default function Settings() {
  // General Settings
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("john.doe@example.com");
  const [timezone, setTimezone] = useState("America/New_York");

  // API & Limits
  const apiKey = "<YOUR_API_KEY>"

  const [lastUsed] = useState("2025-01-29T14:32:00Z");
  const [rateLimit, setRateLimit] = useState("1000");
  const [showKey, setShowKey] = useState(false);

  // Notifications
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [backupEmails, setBackupEmails] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // const maskApiKey = (key: string) => {
  //   if (!key) return "";
  //   return `${key.slice(0, 12)}${"•".repeat(20)}${key.slice(-4)}`;
  // };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(apiKey);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your tenant configuration and preferences
        </p>
      </div>

      {/* General Settings */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">General</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Basic configuration for your tenant
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localization</CardTitle>
            <CardDescription>
              Configure timezone for scheduled operations and timestamps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Default Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney (AEDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* API & Limits */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">API & Limits</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage API credentials and usage limits
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Key</CardTitle>
            <CardDescription>
              Use this key to authenticate API requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  {/* <Input
                    id="api-key"
                    type="text"
                    value={showKey ? apiKey : maskApiKey(apiKey || "")}
                    readOnly
                    className="font-mono text-sm"
                  /> */}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Last used: {formatTimestamp(lastUsed)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>
              Configure API request rate limits for your tenant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rate-limit">Requests per Minute</Label>
              <Input
                id="rate-limit"
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                min="1"
                max="10000"
              />
              <p className="text-sm text-muted-foreground">
                Applied within platform limits
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Notifications */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure email notification preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Choose which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-alerts" className="text-base">
                  System Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about system updates and maintenance
                </p>
              </div>
              <Switch
                id="system-alerts"
                checked={systemAlerts}
                onCheckedChange={setSystemAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="security-alerts" className="text-base">
                  Security Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about security events and suspicious activity
                </p>
              </div>
              <Switch
                id="security-alerts"
                checked={securityAlerts}
                onCheckedChange={setSecurityAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="backup-emails" className="text-base">
                  Backup Emails
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive confirmation emails when backups complete
                </p>
              </div>
              <Switch
                id="backup-emails"
                checked={backupEmails}
                onCheckedChange={setBackupEmails}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
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
