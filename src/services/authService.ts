import { supabase } from '@/lib/supabaseClient';
import { authPersistenceReady, getFirebaseAuth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser,
} from 'firebase/auth';

export interface SyncedUser {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  role: string | null;
  bio: string | null;
  studentId: string | null;
  aspirantType: string | null;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface StudentRecord {
  id: string;
  name: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  firebase_uid: string | null;
  aspirant_type: string | null;
  user_id: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

export interface StudentOnboardingInput {
  fullName: string;
  email: string;
  aspirantType: string;
  phone?: string | null;
}

type SyncUserOverrides = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  bio?: string | null;
  studentId?: string | null;
  aspirantType?: string | null;
  onboardingComplete?: boolean;
  settings?: Record<string, unknown> | null;
};

type PhoneOtpSendResult = {
  confirmationResult: ConfirmationResult;
  phoneNumber: string;
};

let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaRenderPromise: Promise<number> | null = null;
let recaptchaContainer: HTMLDivElement | null = null;

export function ensurePhoneRecaptchaContainer() {
  if (recaptchaContainer?.isConnected) {
    return recaptchaContainer;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  const existingContainer = document.getElementById('recaptcha-container');
  if (existingContainer instanceof HTMLDivElement) {
    recaptchaContainer = existingContainer;
    return recaptchaContainer;
  }

  const container = document.createElement('div');
  container.id = 'recaptcha-container';
  container.setAttribute('aria-hidden', 'false');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '1px';
  container.style.height = '1px';
  container.style.overflow = 'hidden';
  container.style.opacity = '0';

  const host = document.head ?? document.documentElement;
  host.appendChild(container);

  recaptchaContainer = container;
  return container;
}

function getFirebaseAuthErrorCode(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code?: unknown }).code ?? '');
  }

  return '';
}

function getFirebaseAuthErrorMessage(error: unknown) {
  const code = getFirebaseAuthErrorCode(error);

  if (code === 'auth/invalid-api-key') {
    return 'Firebase API key is invalid or not enabled for this project. Verify the deployed VITE_FIREBASE_* values and API key restrictions.';
  }

  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized for Firebase Phone Auth. Add the current host to Firebase Authentication authorized domains.';
  }

  if (code === 'auth/invalid-phone-number') {
    return 'Enter a valid Indian phone number in +91 format.';
  }

  if (code === 'auth/too-many-requests') {
    return 'Too many OTP requests. Try again in a few minutes.';
  }

  if (code === 'auth/invalid-app-credential') {
    return 'Phone OTP is misconfigured. Check Firebase Phone Auth, reCAPTCHA, and authorized domains.';
  }

  if (code === 'auth/captcha-check-failed') {
    return 'reCAPTCHA verification failed. Please retry the OTP request.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Network error while sending the OTP. Check your connection and try again.';
  }

  return error instanceof Error ? error.message : 'Unable to complete phone authentication.';
}

export function canonicalIndianPhoneNumber(phoneNumber?: string | null) {
  if (!phoneNumber) {
    return '';
  }

  const trimmed = phoneNumber.trim();
  if (trimmed.startsWith('+')) {
    return trimmed.replace(/\s+/g, '');
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  return digits ? `+${digits}` : '';
}

function clearPhoneRecaptchaVerifier() {
  try {
    recaptchaVerifier?.clear();
  } catch {
    // Ignore cleanup failures; the verifier is being discarded anyway.
  }

  recaptchaVerifier = null;
  recaptchaRenderPromise = null;
}

function getRecaptchaContainer() {
  if (recaptchaContainer?.isConnected) {
    return recaptchaContainer;
  }

  const container = ensurePhoneRecaptchaContainer();
  if (!(container instanceof HTMLDivElement)) {
    throw new Error('Missing recaptcha container. The app must create <div id="recaptcha-container" /> before sending OTP.');
  }

  recaptchaContainer = container;
  return container;
}

async function getPhoneRecaptchaVerifier() {
  const auth = getFirebaseAuth();

  if (recaptchaVerifier) {
    return recaptchaVerifier;
  }

  const container = getRecaptchaContainer();
  recaptchaVerifier = new RecaptchaVerifier(auth, container, {
    size: 'invisible',
  });

  return recaptchaVerifier;
}

export async function resetPhoneRecaptchaVerifier() {
  clearPhoneRecaptchaVerifier();

  if (typeof window !== 'undefined' && recaptchaContainer?.isConnected) {
    recaptchaContainer.innerHTML = '';
  }
}

export async function sendPhoneOtp(phoneNumber: string): Promise<PhoneOtpSendResult> {
  const formattedPhoneNumber = formatIndianPhoneNumber(phoneNumber);
  const auth = getFirebaseAuth();

  if (!formattedPhoneNumber) {
    throw new Error('Enter a valid 10-digit Indian phone number.');
  }

  clearPhoneRecaptchaVerifier();

  await authPersistenceReady.catch(() => undefined);

  const verifier = await getPhoneRecaptchaVerifier();

  try {
    if (!recaptchaRenderPromise) {
      recaptchaRenderPromise = verifier.render();
    }

    await recaptchaRenderPromise;
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, verifier);
    return { confirmationResult, phoneNumber: formattedPhoneNumber };
  } catch (error) {
    const code = getFirebaseAuthErrorCode(error);

    if (code === 'auth/invalid-app-credential' || code === 'auth/captcha-check-failed' || code === 'auth/too-many-requests') {
      clearPhoneRecaptchaVerifier();
    }

    throw new Error(getFirebaseAuthErrorMessage(error));
  }
}

export async function verifyPhoneOtp(confirmationResult: ConfirmationResult, code: string) {
  const otpCode = code.trim();

  if (otpCode.length !== 6) {
    throw new Error('Enter the 6-digit OTP.');
  }

  try {
    return await confirmationResult.confirm(otpCode);
  } catch (error) {
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
}

export function createSyncedUserFromFirebaseUser(firebaseUser: FirebaseUser): SyncedUser {
  return {
    id: firebaseUser.uid,
    firebaseUid: firebaseUser.uid,
    name: getFallbackName(firebaseUser),
    email: firebaseUser.email ?? '',
    phone: canonicalIndianPhoneNumber(firebaseUser.phoneNumber),
    avatarUrl: firebaseUser.photoURL ?? null,
    role: null,
    bio: null,
    studentId: null,
    aspirantType: null,
    onboardingComplete: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
}

type UserRow = {
  id: string;
  firebase_uid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string | null;
  bio: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string | null;
};

type StudentRow = {
  id: string;
  name: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  firebase_uid: string | null;
  aspirant_type: string | null;
  user_id: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
};

type UserSettingsRow = {
  aspirantType: string | null;
  onboardingComplete: boolean;
};

function readUserSettings(settings: Record<string, unknown> | null | undefined): UserSettingsRow {
  return {
    aspirantType: typeof settings?.aspirantType === 'string' && settings.aspirantType.trim() ? settings.aspirantType : null,
    onboardingComplete: typeof settings?.onboardingComplete === 'boolean' ? settings.onboardingComplete : true,
  };
}

async function fetchUserSettingsByFirebaseUid(firebaseUid: string) {
  const { data, error } = await supabase
    .from('users')
    .select('settings')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.settings as Record<string, unknown> | null) ?? null;
}

export function normalizeIndianPhoneNumber(phoneNumber?: string | null) {
  if (!phoneNumber) {
    return '';
  }

  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits.slice(0, 10);
  }

  return digits.slice(-10);
}

export function formatIndianPhoneNumber(phoneNumber: string) {
  const digits = normalizeIndianPhoneNumber(phoneNumber);
  return digits.length === 10 ? `+91${digits}` : '';
}

function getFallbackName(firebaseUser: FirebaseUser) {
  if (firebaseUser.displayName?.trim()) {
    return firebaseUser.displayName.trim();
  }

  if (firebaseUser.email?.trim()) {
    return firebaseUser.email.split('@')[0] ?? 'Student';
  }

  if (firebaseUser.phoneNumber) {
    return `+91 ${normalizeIndianPhoneNumber(firebaseUser.phoneNumber)}`.trim();
  }

  return 'Student';
}

function mapUserRow(row: UserRow): SyncedUser {
  const settings = readUserSettings(row.settings);

  return {
    id: row.id,
    firebaseUid: row.firebase_uid,
    name: row.name ?? 'Student',
    email: row.email ?? '',
    phone: row.phone ?? '',
    avatarUrl: row.avatar_url ?? null,
    role: row.role,
    bio: row.bio,
    studentId: null,
    aspirantType: settings.aspirantType,
    onboardingComplete: settings.onboardingComplete,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapStudentRow(row: StudentRow): StudentRecord {
  return {
    id: row.id,
    name: row.name,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    firebase_uid: row.firebase_uid,
    aspirant_type: row.aspirant_type,
    user_id: row.user_id,
    city: row.city,
    state: row.state,
    created_at: row.created_at,
  };
}

function mapStudentRecordToSyncedUser(student: StudentRecord, fallback: SyncedUser): SyncedUser {
  return {
    ...fallback,
    studentId: student.id,
    aspirantType: student.aspirant_type,
    onboardingComplete: true,
    name: student.name?.trim() || student.full_name?.trim() || fallback.name,
    email: student.email?.trim() || fallback.email,
    phone: canonicalIndianPhoneNumber(student.phone) || fallback.phone,
  };
}

async function queryStudentByPhone(phoneNumber: string) {
  const exactPhone = canonicalIndianPhoneNumber(phoneNumber);
  const fallbackPhone = normalizeIndianPhoneNumber(phoneNumber);

  const [exactResult, fallbackResult] = await Promise.all([
    exactPhone
      ? supabase
          .from('students')
          .select('id, name, full_name, email, phone, firebase_uid, aspirant_type, user_id, city, state, created_at')
          .eq('phone', exactPhone)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    fallbackPhone && fallbackPhone !== exactPhone
      ? supabase
          .from('students')
          .select('id, name, full_name, email, phone, firebase_uid, aspirant_type, user_id, city, state, created_at')
          .eq('phone', fallbackPhone)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (exactResult.error) {
    throw exactResult.error;
  }

  if (fallbackResult.error) {
    throw fallbackResult.error;
  }

  return (exactResult.data ?? fallbackResult.data ?? null) as StudentRow | null;
}

export async function fetchStudentByPhone(phoneNumber: string): Promise<StudentRecord | null> {
  const student = await queryStudentByPhone(phoneNumber);
  return student ? mapStudentRow(student) : null;
}

export async function fetchStudentByEmail(email: string): Promise<StudentRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const { data, error } = await supabase
    .from('students')
    .select('id, name, full_name, email, phone, firebase_uid, aspirant_type, user_id, city, state, created_at')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapStudentRow(data as StudentRow) : null;
}


export async function upsertStudentOnboarding(
  firebaseUid: string,
  phoneNumber: string,
  values: StudentOnboardingInput,
): Promise<StudentRecord> {
  const payload = {
    phone: canonicalIndianPhoneNumber(values.phone ?? phoneNumber),
    firebase_uid: firebaseUid,
    name: values.fullName.trim(),
    full_name: values.fullName.trim(),
    email: values.email.trim().toLowerCase(),
    aspirant_type: values.aspirantType,
  };

  const { data, error } = await supabase
    .from('students')
    .upsert(payload, { onConflict: 'phone' })
    .select('id, name, full_name, email, phone, firebase_uid, aspirant_type, user_id, city, state, created_at')
    .single();

  if (error) {
    throw error;
  }

  return mapStudentRow(data as StudentRow);
}

export async function syncFirebaseUserToSupabase(firebaseUser: FirebaseUser, overrides: SyncUserOverrides = {}): Promise<SyncedUser> {
  const nextSettings =
    overrides.settings !== undefined || overrides.aspirantType !== undefined || overrides.onboardingComplete !== undefined
      ? {
          ...((await fetchUserSettingsByFirebaseUid(firebaseUser.uid)) ?? {}),
          ...(overrides.settings ?? {}),
          ...(overrides.aspirantType !== undefined ? { aspirantType: overrides.aspirantType } : {}),
          ...(overrides.onboardingComplete !== undefined ? { onboardingComplete: overrides.onboardingComplete } : {}),
        }
      : undefined;

  const payload = {
    firebase_uid: firebaseUser.uid,
    name: overrides.name ?? getFallbackName(firebaseUser),
    email: overrides.email ?? firebaseUser.email ?? null,
    phone: overrides.phone ?? canonicalIndianPhoneNumber(firebaseUser.phoneNumber),
    avatar_url: overrides.avatarUrl ?? firebaseUser.photoURL ?? null,
    ...(nextSettings ? { settings: nextSettings } : {}),
  };

  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'firebase_uid' })
    .select('id, firebase_uid, name, email, phone, avatar_url, role, bio, settings, created_at, updated_at')
    .single();

  if (error) {
    throw error;
  }

  return {
    ...mapUserRow(data as UserRow),
    studentId: overrides.studentId ?? null,
  };
}

export async function fetchSyncedUserByFirebaseUid(firebaseUid: string): Promise<SyncedUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, firebase_uid, name, email, phone, avatar_url, role, bio, settings, created_at, updated_at')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapUserRow(data as UserRow) : null;
}
