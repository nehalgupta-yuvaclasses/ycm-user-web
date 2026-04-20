import { Card, CardContent } from '@/components/ui/card';
import type { ProfileData } from '@/features/profile/types';

interface ProfileViewProps {
  profile: ProfileData;
}

const VIEW_FIELDS = [
  { label: 'First Name', getValue: (profile: ProfileData) => profile.firstName || 'Not set' },
  { label: 'Last Name', getValue: (profile: ProfileData) => profile.lastName || 'Not set' },
  { label: 'Email', getValue: (profile: ProfileData) => profile.email || 'Not set' },
  { label: 'Phone', getValue: (profile: ProfileData) => profile.phone || 'Add a phone number' },
] as const;

export function ProfileView({ profile }: ProfileViewProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-medium text-foreground">Personal Details</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {VIEW_FIELDS.map((field) => (
            <div key={field.label} className="space-y-1 rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">{field.label}</p>
              <p className="text-sm text-foreground">{field.getValue(profile)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Bio</p>
          <p className="text-sm text-foreground">
            {profile.bio.trim() ? profile.bio : 'Tell us about yourself'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}