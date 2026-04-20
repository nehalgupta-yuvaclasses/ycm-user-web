import { Link } from 'react-router-dom';
import { Camera, Edit3, Mail, MapPin, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ProfileData } from '@/features/profile/types';

interface ProfileHeaderProps {
  profile: ProfileData;
  isEditing: boolean;
  onEdit: () => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileHeader({ profile, isEditing, onEdit, onAvatarChange }: ProfileHeaderProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="relative self-start sm:self-center">
            <Avatar className="size-20 border border-border">
              <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.fullName} />
              <AvatarFallback>{profile.initials}</AvatarFallback>
            </Avatar>
            <label className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
              <Camera className="size-4" />
              <span className="sr-only">Upload avatar</span>
              <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </label>
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">{profile.fullName}</h1>
                <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">{profile.tag}</span>
              </div>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>

            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span className="truncate">{profile.phone || 'Add a phone number'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span className="truncate">{profile.location ?? 'Location not set'}</span>
              </div>
            </div>
          </div>

          <Button onClick={onEdit} variant={isEditing ? 'outline' : 'default'} className="w-full gap-2 sm:w-auto">
            <Edit3 className="size-4" />
            {isEditing ? 'Editing' : 'Edit Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}