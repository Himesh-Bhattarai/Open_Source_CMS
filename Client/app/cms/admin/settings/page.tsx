"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground mt-2">Configure platform-wide settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
          </CardTitle>
          <CardDescription>Central controls for platform administration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Use the links below to manage core platform modules:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/cms/settings">User Settings</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cms/backups">Backup Policies</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cms/integrations">Integrations</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cms/theme">Theme Engine</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
