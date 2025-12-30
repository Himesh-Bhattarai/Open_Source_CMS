"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, Eye, MousePointerClick, Clock, Globe, Download, Calendar } from "lucide-react"
import { useState } from "react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7days")

  const stats = [
    {
      title: "Total Visitors",
      value: "12,345",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Page Views",
      value: "45,678",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Avg. Session",
      value: "3m 24s",
      change: "-2.1%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Bounce Rate",
      value: "42.3%",
      change: "-5.4%",
      trend: "up",
      icon: MousePointerClick,
    },
  ]

  const topPages = [
    { page: "/", views: 8234, change: "+15%" },
    { page: "/products", views: 5123, change: "+8%" },
    { page: "/about", views: 3456, change: "+12%" },
    { page: "/contact", views: 2134, change: "+5%" },
    { page: "/blog", views: 1876, change: "-3%" },
  ]

  const topCountries = [
    { country: "United States", visitors: 4523, flag: "🇺🇸" },
    { country: "United Kingdom", visitors: 2134, flag: "🇬🇧" },
    { country: "Canada", visitors: 1876, flag: "🇨🇦" },
    { country: "Australia", visitors: 1234, flag: "🇦🇺" },
    { country: "Germany", visitors: 987, flag: "🇩🇪" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your website performance and visitor insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="text-muted-foreground">from last period</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitors Overview</CardTitle>
              <CardDescription>Daily visitor trends for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{page.page}</p>
                        <p className="text-xs text-muted-foreground">{page.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <Badge variant={page.change.startsWith("+") ? "default" : "secondary"}>{page.change}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCountries.map((country, index) => (
                  <div
                    key={country.country}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <p className="font-medium text-sm">{country.country}</p>
                        <p className="text-xs text-muted-foreground">{country.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {((country.visitors / stats[0].value.replace(/,/g, "")) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Sources bringing traffic to your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { source: "google.com", visitors: 5234, type: "Search" },
                  { source: "facebook.com", visitors: 2134, type: "Social" },
                  { source: "twitter.com", visitors: 1876, type: "Social" },
                  { source: "Direct", visitors: 1543, type: "Direct" },
                  { source: "linkedin.com", visitors: 987, type: "Social" },
                ].map((referrer) => (
                  <div
                    key={referrer.source}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{referrer.source}</p>
                        <p className="text-xs text-muted-foreground">{referrer.type}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{referrer.visitors.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
