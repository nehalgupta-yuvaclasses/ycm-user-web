import { updatePassword as updateFirebasePassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabaseClient';
import { syncFirebaseUserToSupabase } from '@/services/authService';
import type { SettingsProfile, UserSettings } from './types';

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  firebase_uid: string;
  settings: Record<string, unknown> | null;
};

const DEFAULT_SETTINGS: UserSettings = {
  language: 'en-IN',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

function readSettings(rawSettings?: Partial<UserSettings> | null): UserSettings {
  const notifications = (rawSettings?.notifications ?? {}) as Partial<UserSettings['notifications']>;

  return {
    language: rawSettings?.language ?? DEFAULT_SETTINGS.language,
    notifications: {
      email: notifications.email ?? DEFAULT_SETTINGS.notifications.email,
      push: notifications.push ?? DEFAULT_SETTINGS.notifications.push,
      sms: notifications.sms ?? DEFAULT_SETTINGS.notifications.sms,
    },
  };
}

async function resolveSettingsProfile(): Promise<SettingsProfile> {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error('You must be signed in to manage settings.');
  }

  const syncedUser = await syncFirebaseUserToSupabase(firebaseUser);
  const { data: userRecord } = await supabase
    .from('users')
    .select('id, name, email, settings')
    .eq('firebase_uid', firebaseUser.uid)
    .maybeSingle();

  return {
    id: syncedUser.id,
    name: userRecord?.name ?? syncedUser.name,
    email: userRecord?.email ?? syncedUser.email,
    settings: readSettings((userRecord?.settings as Partial<UserSettings> | undefined) ?? null),
    rawSettings: (userRecord?.settings ?? {}) as Record<string, unknown>,
  };
}

export async function fetchSettingsProfile(): Promise<SettingsProfile> {
  return resolveSettingsProfile();
}

export async function updateNotificationPreferences(notifications: UserSettings['notifications']) {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error('You must be signed in to update settings.');
  }

  const current = await resolveSettingsProfile();
  const nextSettings: UserSettings = {
    ...current.settings,
    notifications,
  };

  const mergedSettings: Record<string, unknown> = {
    ...current.rawSettings,
    ...nextSettings,
    notifications,
  };

  const result = await supabase
    .from('users')
    .update({ settings: mergedSettings })
    .eq('firebase_uid', firebaseUser.uid);

  if (result.error) {
    throw result.error;
  }

  return fetchSettingsProfile();
}

export async function updateLanguage(language: string) {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error('You must be signed in to update settings.');
  }

  const current = await resolveSettingsProfile();
  const nextSettings: UserSettings = {
    ...current.settings,
    language,
  };

  const mergedSettings: Record<string, unknown> = {
    ...current.rawSettings,
    ...nextSettings,
    language,
  };

  const result = await supabase
    .from('users')
    .update({ settings: mergedSettings })
    .eq('firebase_uid', firebaseUser.uid);

  if (result.error) {
    throw result.error;
  }

  return fetchSettingsProfile();
}

export async function updatePassword(nextPassword: string) {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error('You must be signed in to update your password.');
  }

  await updateFirebasePassword(firebaseUser, nextPassword);

  return true;
}
