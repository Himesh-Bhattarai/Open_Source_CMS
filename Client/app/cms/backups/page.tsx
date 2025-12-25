"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Download, RotateCcw, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

interface Backup {
  id: number
  name: string
  type: string
  size: string
  status: string
  date: string
  includes: string[]
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
  ])

  const [frequency, setFrequency] = useState("daily")
  const [retention, setRetention] = useState("30")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)
  const [backupIncludes, setBackupIncludes] = useState({
    pages: true,
    media: true,
    settings: true,
    database: true,
  })

  const handleCreateBackup = () => {
    const newBackup: Backup = {
      id: Date.now(),
      name: `Manual Backup - ${new Date().toLocaleString()}`,
      type: "manual",
      size: "1.2 GB",
      status: "completed",
      date: new Date().toISOString(),
      includes: Object.keys(backupIncludes).filter((k) => backupIncludes[k as keyof typeof backupIncludes]),
    }
    setBackups([newBackup, ...backups])
    setIsCreateDialogOpen(false)
    alert("Backup created successfully!")
  }

  const handleRestore = () => {
    if (selectedBackup) {
      console.log("[v0] Restoring backup:", selectedBackup)
      alert(`Restoring backup: ${selectedBackup.name}`)
      setIsRestoreDialogOpen(false)
      setSelectedBackup(null)
    }
  }

  const handleDownload = (backup: Backup) => {
    console.log("[v0] Downloading backup:", backup)
    alert(`Downloading: ${backup.name}`)
  }

  const saveSettings = () => {
    console.log("[v0] Saving backup settings:", { frequency, retention })
    alert("Backup settings saved!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backups</h1>
          <p className="text-muted-foreground mt-2">Backup and restore your website data</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Manual Backup</DialogTitle>
              <DialogDescription>Select what to include in your backup</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pages"
                  checked={backupIncludes.pages}
                  onCheckedChange={(checked) => setBackupIncludes({ ...backupIncludes, pages: !!checked })}
                />
                <Label htmlFor="pages">Pages & Content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="media"
                  checked={backupIncludes.media}
                  onCheckedChange={(checked) => setBackupIncludes({ ...backupIncludes, media: !!checked })}
                />
                <Label htmlFor="media">Media Library</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="settings"
                  checked={backupIncludes.settings}
                  onCheckedChange={(checked) => setBackupIncludes({ ...backupIncludes, settings: !!checked })}
                />
                <Label htmlFor="settings">Settings & Configuration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="database"
                  checked={backupIncludes.database}
                  onCheckedChange={(checked) => setBackupIncludes({ ...backupIncludes, database: !!checked })}
                />
                <Label htmlFor="database">Database</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBackup}>Create Backup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.7 GB</div>
            <p className="text-xs text-muted-foreground mt-1">23% of quota</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12h</div>
            <p className="text-xs text-muted-foreground mt-1">ago</p>
          </CardContent>
        </Card>
      </div>

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
              <label className="text-sm font-medium mb-2 block">Backup Frequency</label>
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
              <label className="text-sm font-medium mb-2 block">Retention Period</label>
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

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>Download or restore from previous backups</CardDescription>
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
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {backup.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-medium">{backup.name}</h3>
                      <Badge variant={backup.type === "automatic" ? "secondary" : "default"}>{backup.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {backup.size} • {backup.date}
                    </p>
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
                  <Button variant="outline" size="sm" onClick={() => handleDownload(backup)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBackup(backup)}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Restore Backup</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to restore this backup? This will overwrite your current data.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedBackup && (
                        <div className="py-4">
                          <p className="font-medium">{selectedBackup.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{selectedBackup.date}</p>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleRestore}>
                          Restore Backup
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
  )
}
