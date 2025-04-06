import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    enableEmailNotifications: true,
    enableActivityLogging: true,
    retentionPeriodDays: 30,
    autoDeleteInactiveDays: 365,
  });
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your admin settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive email notifications for important admin events
            </span>
          </Label>
          <Switch
            id="email-notifications"
            checked={settings.enableEmailNotifications}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, enableEmailNotifications: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="activity-logging" className="flex flex-col space-y-1">
            <span>Activity Logging</span>
            <span className="font-normal text-sm text-muted-foreground">
              Log all admin actions for audit purposes
            </span>
          </Label>
          <Switch
            id="activity-logging"
            checked={settings.enableActivityLogging}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, enableActivityLogging: checked }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="retention-period">Log Retention Period (days)</Label>
          <Input
            id="retention-period"
            type="number"
            value={settings.retentionPeriodDays}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                retentionPeriodDays: parseInt(e.target.value),
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="auto-delete">
            Auto-delete inactive users (days)
          </Label>
          <Input
            id="auto-delete"
            type="number"
            value={settings.autoDeleteInactiveDays}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                autoDeleteInactiveDays: parseInt(e.target.value),
              }))
            }
          />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
}; 