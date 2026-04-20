import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogOut, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileView } from '@/components/profile/ProfileView';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { useProfile, useUpdateProfile } from '@/features/profile/hooks';
import type { ProfileData, ProfileFormValues } from '@/features/profile/types';
import { useAuthModal } from '@/contexts/AuthContext';

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-36 w-full rounded-lg" />
      <Skeleton className="h-44 w-full rounded-lg" />
      <Skeleton className="h-56 w-full rounded-lg" />
      <Skeleton className="h-28 w-full rounded-lg" />
    </div>
  );
}

function getInitialFormValues(profile: ProfileData): ProfileFormValues {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
  };
}

function validate(values: ProfileFormValues) {
  const errors: Partial<Record<keyof ProfileFormValues, string>> = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (values.phone.trim() && values.phone.trim().length < 10) {
    errors.phone = 'Enter a valid phone number.';
  }

  return errors;
}

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuthModal();
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formValues, setFormValues] = React.useState<ProfileFormValues | null>(null);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ProfileFormValues, string>>>({});

  React.useEffect(() => {
    if (profile && !formValues) {
      setFormValues(getInitialFormValues(profile));
    }
  }, [profile, formValues]);

  if (isError) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-foreground">Unable to load profile</p>
          <p className="text-sm text-muted-foreground">Try again in a moment.</p>
          <Button onClick={() => refetch()} className="w-full sm:w-auto">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !profile) {
    return <ProfileSkeleton />;
  }

  const currentValues = formValues ?? getInitialFormValues(profile);
  const previewProfile: ProfileData = {
    ...profile,
    firstName: currentValues.firstName,
    lastName: currentValues.lastName,
    fullName: [currentValues.firstName, currentValues.lastName].filter(Boolean).join(' ') || profile.fullName,
    email: currentValues.email,
    phone: currentValues.phone,
    bio: currentValues.bio,
    avatarUrl: currentValues.avatarUrl,
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!dataUrl) {
        return;
      }

      setFormValues((current) => ({ ...(current ?? getInitialFormValues(profile)), avatarUrl: dataUrl }));
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleEditToggle = () => {
    if (isEditing) {
      return;
    }

    setFormValues(getInitialFormValues(profile));
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormValues(getInitialFormValues(profile));
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formValues) {
      return;
    }

    const nextErrors = validate(formValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const updatedProfile = await updateProfileMutation.mutateAsync(formValues);
      setFormValues(getInitialFormValues(updatedProfile));
      setIsEditing(false);
      toast.success('Profile updated successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile.';
      toast.error(message);
    }
  };

  const handleChange = <K extends keyof ProfileFormValues>(field: K, value: ProfileFormValues[K]) => {
    setFormValues((current) => ({ ...(current ?? getInitialFormValues(profile)), [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to log out.';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">View and update your account details</p>
      </div>

      <ProfileHeader profile={previewProfile} isEditing={isEditing} onEdit={handleEditToggle} onAvatarChange={handleAvatarChange} />

      {isEditing ? (
        <ProfileEditForm
          profile={previewProfile}
          values={currentValues}
          errors={errors}
          isSaving={updateProfileMutation.isPending}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ProfileView profile={profile} />
      )}

      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div>
            <h2 className="text-base font-medium text-foreground">Account Actions</h2>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Button nativeButton={false} render={<Link to="/dashboard/settings" />} variant="outline" className="w-full gap-2">
              <ShieldCheck className="size-4" />
              Change Password
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full gap-2">
              <LogOut className="size-4" />
              Logout
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="w-full gap-2">
              <Lock className="size-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}