"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotification } from "@/Api/Notification/notification"
import { toast } from "sonner"

type LogItem = {
  _id?: string
  action?: string
  message?: string
  createdAt?: string
  read?: boolean
}

export default function AdminLogsPage() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<LogItem[]>([])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const response = await getNotification()
      const data = response?.data
      const normalized = Array.isArray(data?.notifications)
        ? data.notifications
        : Array.isArray(data)
          ? data
          : []
      setLogs(normalized)
    } catch (error: any) {
      toast.error(error?.message || "Failed to load logs")
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const unreadCount = useMemo(() => logs.filter((log) => !log.read).length, [logs])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground mt-2">
            Monitor backend event notifications and recent platform activity
          </p>
        </div>
        <Button variant="outline" onClick={loadLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Activity
          </CardTitle>
          <CardDescription>
            {unreadCount} unread event{unreadCount === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground py-8">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-muted-foreground py-8">No logs available</p>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 20).map((log, index) => (
                <div key={log._id || `log-${index}`} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{log.action || "Event"}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {log.message || "No message provided"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : "Unknown time"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
