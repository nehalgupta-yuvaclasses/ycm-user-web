import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import type { NotificationPreferences } from '@/features/settings/types';

interface NotificationSettingsProps {
  value: NotificationPreferences;
  onToggle: (key: keyof NotificationPreferences, checked: boolean) => void;
  isSaving?: boolean;
}

const ITEMS = [
  {
    key: 'email' as const,
    title: 'Email Notifications',
    description: 'Receive updates about classes, tests, and resources.',
  },
  {
    key: 'push' as const,
    title: 'Push Notifications',
    description: 'Get quick alerts for important learning activity.',
  },
  {
    key: 'sms' as const,
    title: 'SMS Alerts',
    description: 'Get exam and schedule updates by text message.',
  },
];

export function NotificationSettings({ value, onToggle, isSaving }: NotificationSettingsProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-medium text-foreground">Notifications</h2>
        </div>

        <div className="space-y-3">
          {ITEMS.map((item, index) => (
            <div key={item.key} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Label htmlFor={item.key} className="text-sm font-medium text-foreground">
                    {item.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  id={item.key}
                  checked={value[item.key]}
                  onCheckedChange={(checked) => onToggle(item.key, checked)}
                  disabled={isSaving}
                />
              </div>
              {index < ITEMS.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
