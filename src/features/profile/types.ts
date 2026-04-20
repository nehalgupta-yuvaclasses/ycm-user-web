export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string | null;
  tag: string;
  location: string | null;
  initials: string;
}

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string | null;
}