import * as React from 'react';
import { Lock, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SecuritySettingsProps {
  onOpenChangePassword: (nextPassword: string) => Promise<void>;
  onManageDevices: () => void;
  isSaving?: boolean;
}

export function SecuritySettings({ onOpenChangePassword, onManageDevices }: SecuritySettingsProps) {
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(false);
  const [nextPassword, setNextPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    const trimmedPassword = nextPassword.trim();

    if (trimmedPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (trimmedPassword !== confirmPassword.trim()) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onOpenChangePassword(trimmedPassword);
      setIsPasswordOpen(false);
      setNextPassword('');
      setConfirmPassword('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div>
            <h2 className="text-base font-medium text-foreground">Account Security</h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => setIsPasswordOpen(true)} variant="outline" className="w-full gap-2 sm:w-auto">
              <Lock className="size-4" />
              Change Password
            </Button>
            <Button onClick={onManageDevices} variant="outline" className="w-full gap-2 sm:w-auto">
              <Smartphone className="size-4" />
              Manage Devices
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Choose a new password for your account.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
