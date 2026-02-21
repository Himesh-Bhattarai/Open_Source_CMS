"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchStats } from "@/Api/Stats/Stats";
import { toast } from "sonner";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, any>>({});

  const loadStats = async () => {
    try {
      setLoading(true);
      const dashboard = await fetchStats("For-Dashboard");
      setStats(dashboard?.data || dashboard || {});
    } catch (error: any) {
      toast.error(error?.message || "Failed to load analytics");
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const metricEntries = Object.entries(stats || {}).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor platform-wide metrics and performance
          </p>
        </div>
        <Button variant="outline" onClick={loadStats} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Snapshot
          </CardTitle>
          <CardDescription>
            Live dashboard values from the backend statistics service
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading analytics...</p>
          ) : metricEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No analytics data available</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {metricEntries.map(([key, value]) => (
                <div key={key} className="rounded-lg border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{key}</p>
                  <p className="text-2xl font-semibold mt-1">{String(value)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This page reads backend stats only. Role/permission controls remain enforced by backend
          middleware.
        </CardContent>
      </Card>
    </div>
  );
}
