"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, CheckCircle, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { getNotification } from "@/Api/Notification/notification"

interface Notification {
  id: number
  type: string
  title: string
  message: string
  time: string
  read: boolean
}

export default function NotificationsPage() {
 const [notifications, setNotifications] = useState<Notification[]>([]);
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState("");

  const [emailSettings, setEmailSettings] = useState({
    contentPublished: true,
    teamActivity: true,
    systemUpdates: true,
  })

  const [appSettings, setAppSettings] = useState({
    desktopNotifications: false,
    soundAlerts: false,
  })
  

  //loadNotification
  useEffect(() => {
    const loadNotif = async () => {
      setLoading(true);
      const notif = await getNotification();
      const notificationsArray = notif.data?.notifications || [];
      if (!notif.ok) {
        setMessage(notif?.message ?? "Failed to load notifications");
        setLoading(false);
        return;
      }

      // map _id → id and createdAt → time
      const formatted = notificationsArray.map((n: any) => ({
        id: n._id,
        type: n.type.toLowerCase(), 
        title: n.title,
        message: n.message,
        time: n.createdAt,
        read: n.read,
      }));

      setNotifications(formatted);
      setLoading(false);
    };
    loadNotif();
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  
  
  //filter notification by time show only the last 7 days
  const filteredNotifications = notifications.filter((n)=>{
    const notificationData = new Date(n.time);
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return notificationData >= sevenDaysAgo
  })
  
  const unreadCount = filteredNotifications.filter((n) => !n.read).length


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-2">Manage your notification preferences</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No notifications</p>
                  <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
                </div>
              ) : (
                  filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${!notification.read ? "bg-accent/50" : ""}`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        notification.type === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : notification.type === "warning"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {notification.type === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.read && (
                          <Badge variant="default" className="h-5">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredNotifications.filter((n) => !n.read).length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <p className="text-lg font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground mt-1">No unread notifications</p>
                </div>
              ) : (
                filteredNotifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg border bg-accent/50">
                      <div
                        className={`p-2 rounded-lg ${
                          notification.type === "success"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {notification.type === "success" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                        Mark Read
                      </Button>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Choose what updates you receive via email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Content Published</Label>
                  <p className="text-sm text-muted-foreground">Notify when content is published</p>
                </div>
                <Switch
                  checked={emailSettings.contentPublished}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, contentPublished: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Activity</Label>
                  <p className="text-sm text-muted-foreground">Notify about team member actions</p>
                </div>
                <Switch
                  checked={emailSettings.teamActivity}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, teamActivity: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">Important platform updates</p>
                </div>
                <Switch
                  checked={emailSettings.systemUpdates}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, systemUpdates: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                In-App Notifications
              </CardTitle>
              <CardDescription>Manage notifications within the CMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show browser notifications</p>
                </div>
                <Switch
                  checked={appSettings.desktopNotifications}
                  onCheckedChange={(checked) => setAppSettings({ ...appSettings, desktopNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">Play sound for important updates</p>
                </div>
                <Switch
                  checked={appSettings.soundAlerts}
                  onCheckedChange={(checked) => setAppSettings({ ...appSettings, soundAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
