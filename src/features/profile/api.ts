import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabaseClient';
import { syncFirebaseUserToSupabase } from '@/services/authService';
import type { ProfileData, ProfileFormValues } from './types';

type AuthUser = {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  firebase_uid: string;
};

type StudentRow = {
  id: string;
  full_name: string;
  email: string;
  city: string | null;
  state: string | null;
};

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
};

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'S'
  );
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

async function resolveContext() {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error('You must be signed in to view your profile.');
  }

  const [userRecord, profileResponse, studentResponse] = await Promise.all([
    syncFirebaseUserToSupabase(firebaseUser),
    firebaseUser.email
      ? supabase.from('profiles').select('id, name, email, role').eq('email', firebaseUser.email).maybeSingle()
      : Promise.resolve({ data: null }),
    firebaseUser.email
      ? supabase.from('students').select('id, full_name, email, city, state').eq('email', firebaseUser.email).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    authUser: firebaseUser as AuthUser,
    userRecord,
    profileRecord: (profileResponse.data as ProfileRow | null) ?? null,
    studentRecord: (studentResponse.data as StudentRow | null) ?? null,
  };
}

export async function fetchProfile(): Promise<ProfileData> {
  const context = await resolveContext();
  const baseName =
    context.userRecord?.name ??
    context.profileRecord?.name ??
    context.studentRecord?.full_name ??
    context.authUser?.displayName ??
    context.authUser?.email?.split('@')[0] ??
    context.authUser?.phoneNumber?.replace('+91', '') ??
    'Student';

  const { firstName, lastName } = splitName(baseName);
  const email = context.userRecord?.email ?? context.profileRecord?.email ?? context.studentRecord?.email ?? context.authUser?.email ?? '';
  const bio = context.userRecord?.bio ?? '';
  const avatarUrl = context.userRecord?.avatarUrl ?? context.authUser?.photoURL ?? null;
  const phone = (context.userRecord?.phone ?? context.authUser?.phoneNumber ?? '').trim();
  const locationParts = [context.studentRecord?.city, context.studentRecord?.state].filter(Boolean);
  const role = context.userRecord?.role ?? context.profileRecord?.role ?? 'student';

  return {
    id: context.userRecord?.id ?? context.profileRecord?.id ?? context.studentRecord?.id ?? context.authUser?.uid ?? 'guest',
    firstName,
    lastName,
    fullName: baseName,
    email,
    phone,
    bio,
    avatarUrl,
    tag: role === 'admin' ? 'Administrator' : 'SSC Aspirant',
    location: locationParts.length > 0 ? locationParts.join(', ') : null,
    initials: getInitials(baseName),
  };
}

export async function updateProfile(values: ProfileFormValues) {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error('You must be signed in to update your profile.');
  }

  const name = [values.firstName.trim(), values.lastName.trim()].filter(Boolean).join(' ').trim();
  const profileUpdate = {
    firebase_uid: firebaseUser.uid,
    name: name || values.firstName.trim() || values.lastName.trim() || 'Student',
    email: values.email.trim() || null,
    avatar_url: values.avatarUrl,
    bio: values.bio.trim(),
    phone: values.phone.trim() || null,
  };

  const { error } = await supabase.from('users').upsert(profileUpdate, { onConflict: 'firebase_uid' });

  if (error) {
    throw error;
  }

  await updateFirebaseProfile(firebaseUser, {
    displayName: profileUpdate.name,
    photoURL: values.avatarUrl ?? undefined,
  });

  if (values.email.trim() && values.email.trim() !== (firebaseUser.email ?? '')) {
    console.warn('Firebase email updates are not applied automatically from profile edits.');
  }

  return fetchProfile();
}