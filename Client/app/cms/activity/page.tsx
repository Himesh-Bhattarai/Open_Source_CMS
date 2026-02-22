"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, Upload, Trash2, Edit, User, Download, Filter, X } from "lucide-react";
import { useState } from "react";

interface ActivityLog {
  id: number;
  action: string;
  type: string;
  item: string;
  user: string;
  userEmail: string;
  timestamp: string;
  ip: string;
  details: string;
}

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: 1,
      action: "published",
      type: "page",
      item: "About Us",
      user: "Sarah K.",
      userEmail: "sarah@example.com",
      timestamp: "2025-01-20 14:30:25",
      ip: "192.168.1.1",
      details: "Published page with 3 content blocks",
    },
    {
      id: 2,
      action: "updated",
      type: "menu",
      item: "Main Navigation",
      user: "Mike R.",
      userEmail: "mike@example.com",
      timestamp: "2025-01-20 13:15:42",
      ip: "192.168.1.5",
      details: "Added 2 new menu items",
    },
    {
      id: 3,
      action: "uploaded",
      type: "media",
      item: "hero-banner.jpg",
      user: "Admin",
      userEmail: "admin@example.com",
      timestamp: "2025-01-20 12:05:10",
      ip: "192.168.1.2",
      details: "Uploaded image (2.4 MB)",
    },
    {
      id: 4,
      action: "deleted",
      type: "page",
      item: "Old Services",
      user: "Sarah K.",
      userEmail: "sarah@example.com",
      timestamp: "2025-01-20 11:20:33",
      ip: "192.168.1.1",
      details: "Permanently deleted draft page",
    },
    {
      id: 5,
      action: "updated",
      type: "settings",
      item: "SEO Settings",
      user: "Admin",
      userEmail: "admin@example.com",
      timestamp: "2025-01-20 10:45:18",
      ip: "192.168.1.2",
      details: "Changed meta description and keywords",
    },
  ]);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "all" || activity.action === actionFilter;
    const matchesType = typeFilter === "all" || activity.type === typeFilter;

    return matchesSearch && matchesAction && matchesType;
  });

  const handleExport = () => {
    const csv = [
      ["ID", "Action", "Type", "Item", "User", "Timestamp", "IP", "Details"].join(","),
      ...filteredActivities.map((a) =>
        [a.id, a.action, a.type, a.item, a.user, a.timestamp, a.ip, a.details].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("all");
    setTypeFilter("all");
    setTimeFilter("all");
  };

  const hasActiveFilters =
    searchQuery || actionFilter !== "all" || typeFilter !== "all" || timeFilter !== "all";

  const getActionIcon = (action: string) => {
    switch (action) {
      case "published":
        return <FileText className="h-4 w-4" />;
      case "updated":
        return <Edit className="h-4 w-4" />;
      case "uploaded":
        return <Upload className="h-4 w-4" />;
      case "deleted":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "published":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "updated":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "uploaded":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "deleted":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground mt-2">Monitor all actions and changes</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="page">Pages</SelectItem>
                <SelectItem value="menu">Menus</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Showing {filteredActivities.length} of {activities.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No activities found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className={`p-2 rounded-lg ${getActionColor(activity.action)}`}>
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className="capitalize">
                        {activity.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{activity.type}</span>
                    </div>
                    <p className="font-medium">{activity.item}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {activity.user}
                      </span>
                      <span>{activity.timestamp}</span>
                      <span>IP: {activity.ip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
