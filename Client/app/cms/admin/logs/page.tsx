"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

export default function AdminLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground mt-2">Monitor system activity and errors</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Activity
          </CardTitle>
          <CardDescription>Real-time platform logs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">System logs under development</p>
        </CardContent>
      </Card>
    </div>
  )
}
