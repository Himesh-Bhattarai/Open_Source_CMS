"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Globe, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContent } from "@/lib/types/page";

export interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (type: "now" | "schedule", date?: string, time?: string) => Promise<void>;
  content: PageContent;
  validation?: string[]; // ← ADD THIS
  isGlobal?: boolean;
}

export function PublishModal({
  isOpen,
  onClose,
  onPublish,
  content,
  isGlobal = false,
}: PublishModalProps) {
  const [publishType, setPublishType] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [publishNote, setPublishNote] = useState("");

  const handlePublish = () => {
    if (publishType === "schedule" && (!scheduleDate || !scheduleTime)) {
      return;
    }
    onPublish(publishType, scheduleDate, scheduleTime);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {content.status === "published" ? "Update Published Content" : "Publish Content"}
          </DialogTitle>
          <DialogDescription>
            {isGlobal
              ? "This will affect the entire site. Make sure to preview changes first."
              : "Make your content live for all visitors."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isGlobal && (
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-amber-900 dark:text-amber-100">
                    Global Change Warning
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                    {content.affectedPages
                      ? `This will affect ${content.affectedPages} pages across your site.`
                      : "This will affect your entire website."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Content</Label>
            <div className="flex items-center gap-2">
              <p className="font-medium">{content.title}</p>
              <Badge variant={content.status === "published" ? "default" : "secondary"}>
                {content.status}
              </Badge>
            </div>
          </div>

          <Tabs value={publishType} onValueChange={(v) => setPublishType(v as typeof publishType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="now" className="gap-2">
                <Globe className="h-4 w-4" />
                Publish Now
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2">
                <Clock className="h-4 w-4" />
                Schedule
              </TabsTrigger>
            </TabsList>

            <TabsContent value="now" className="space-y-4 mt-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Publish Immediately</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Content will be live within seconds and visible to all visitors.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleDate">Date</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduleTime">Time</Label>
                  <Input
                    id="scheduleTime"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
              {scheduleDate && scheduleTime && (
                <div className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Will publish on {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="publishNote">Publish Note (Optional)</Label>
            <Textarea
              id="publishNote"
              placeholder="Describe what changed in this version..."
              value={publishNote}
              onChange={(e) => setPublishNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishType === "schedule" && (!scheduleDate || !scheduleTime)}
          >
            {publishType === "now" ? (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Publish Now
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
