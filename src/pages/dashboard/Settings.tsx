import * as React from 'react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PreferencesSettings } from '@/components/settings/PreferencesSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { useChangePassword, useSettingsProfile, useUpdateLanguage, useUpdateNotificationPreferences } from '@/features/settings/hooks';
import type { NotificationPreferences } from '@/features/settings/types';
import { useAuthModal } from '@/contexts/AuthContext';

function SettingsSkeleton() {
  return (
    <div className="space-y-4 pb-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-56 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-28 w-full rounded-lg" />
    </div>
  );
}

export default function Settings() {
  const { logout } = useAuthModal();
  const { data, isLoading, isError, refetch } = useSettingsProfile();
  const notificationMutation = useUpdateNotificationPreferences();
  const languageMutation = useUpdateLanguage();
  const passwordMutation = useChangePassword();
  const [isDevicesOpen, setIsDevicesOpen] = React.useState(false);
  const [draftNotifications, setDraftNotifications] = React.useState(data?.settings.notifications);
  const [draftLanguage, setDraftLanguage] = React.useState(data?.settings.language);

  React.useEffect(() => {
    if (data) {
      setDraftNotifications(data.settings.notifications);
      setDraftLanguage(data.settings.language);
    }
  }, [data]);

  if (isLoading || !data) {
    return <SettingsSkeleton />;
  }

  if (isError) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-foreground">Unable to load settings</p>
          <p className="text-sm text-muted-foreground">Try again in a moment.</p>
          <Button onClick={() => refetch()} className="w-full sm:w-auto">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleNotificationToggle = async (key: keyof NotificationPreferences, checked: boolean) => {
    const currentNotifications = draftNotifications ?? data.settings.notifications;
    const nextNotifications = {
      ...currentNotifications,
      [key]: checked,
    };

    setDraftNotifications(nextNotifications);

    try {
      await notificationMutation.mutateAsync(nextNotifications);
      toast.success('Settings updated');
    } catch (error) {
      setDraftNotifications(currentNotifications);
      toast.error(error instanceof Error ? error.message : 'Unable to update settings');
    }
  };

  const handleLanguageChange = async (language: string) => {
    const previousLanguage = draftLanguage ?? data.settings.language;
    setDraftLanguage(language);

    try {
      await languageMutation.mutateAsync(language);
      toast.success('Settings updated');
    } catch (error) {
      setDraftLanguage(previousLanguage);
      toast.error(error instanceof Error ? error.message : 'Unable to update settings');
    }
  };

  const handlePasswordChange = async (nextPassword: string) => {
    try {
      await passwordMutation.mutateAsync(nextPassword);
      toast.success('Password updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update password';
      toast.error(message);
      throw error;
    }
  };

  const handleSignOutAllDevices = async () => {
    try {
      await logout();
      toast.success('Signed out');
      setIsDevicesOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign out');
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences</p>
      </div>

      <NotificationSettings
        value={draftNotifications ?? data.settings.notifications}
        onToggle={handleNotificationToggle}
        isSaving={notificationMutation.isPending}
      />

      <SecuritySettings onOpenChangePassword={handlePasswordChange} onManageDevices={() => setIsDevicesOpen(true)} />

      <PreferencesSettings
        language={draftLanguage ?? data.settings.language}
        onLanguageChange={handleLanguageChange}
        isSaving={languageMutation.isPending}
      />

      <Separator />

      <Dialog open={isDevicesOpen} onOpenChange={setIsDevicesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Session</DialogTitle>
            <DialogDescription>Review the current sign-in state and end the session if needed.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Session details are managed by your current Firebase login.</p>
            <p>You can sign out now to end the active session on this device.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDevicesOpen(false)}>
              Close
            </Button>
            <Button variant="destructive" onClick={handleSignOutAllDevices} className="gap-2">
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}