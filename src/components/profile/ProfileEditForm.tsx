import * as React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ProfileData, ProfileFormValues } from '@/features/profile/types';

interface ProfileEditFormProps {
  profile: ProfileData;
  values: ProfileFormValues;
  errors: Partial<Record<keyof ProfileFormValues, string>>;
  isSaving: boolean;
  onChange: <K extends keyof ProfileFormValues>(field: K, value: ProfileFormValues[K]) => void;
  onSave: () => void;
  onCancel: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="size-3.5" />
      {message}
    </p>
  );
}

export function ProfileEditForm({ profile, values, errors, isSaving, onChange, onSave, onCancel }: ProfileEditFormProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-medium text-foreground">Edit Profile</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={values.firstName} onChange={(event) => onChange('firstName', event.target.value)} />
            <FieldError message={errors.firstName} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={values.lastName} onChange={(event) => onChange('lastName', event.target.value)} />
            <FieldError message={errors.lastName} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={values.email} readOnly className="bg-muted/40" />
            <p className="text-xs text-muted-foreground">Email is managed from your account sign-in.</p>
            <FieldError message={errors.email} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={values.phone} onChange={(event) => onChange('phone', event.target.value)} placeholder="Add a phone number" />
            <FieldError message={errors.phone} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={values.bio}
              onChange={(event) => onChange('bio', event.target.value)}
              placeholder="Tell us about yourself"
              className="min-h-28"
            />
            <FieldError message={errors.bio} />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={onSave} disabled={isSaving} className="w-full gap-2 sm:w-auto">
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isSaving} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}