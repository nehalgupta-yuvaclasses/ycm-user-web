import { supabase } from "@/lib/supabaseClient";
import { authPersistenceReady, getFirebaseAuth } from "@/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser,
} from "firebase/auth";

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

type RecaptchaState = {
  verifier: RecaptchaVerifier | null;
  container: HTMLDivElement | null;
  renderPromise: Promise<number> | null;
  renderedWidgetId: number | null;
};

const recaptchaState: RecaptchaState = {
  verifier: null,
  container: null,
  renderPromise: null,
  renderedWidgetId: null,
};

export function ensurePhoneRecaptchaContainer(): HTMLDivElement | null {
  if (recaptchaState.container?.isConnected) {
    return recaptchaState.container;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const existingContainer = document.getElementById("recaptcha-container");
  if (existingContainer instanceof HTMLDivElement) {
    recaptchaState.container = existingContainer;
    return existingContainer;
  }

  const container = document.createElement("div");
  container.id = "recaptcha-container";

  // Use visibility:hidden instead of position:-9999px to properly initialize reCAPTCHA
  // while keeping it hidden from view
  container.style.cssText = `
    position: fixed !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
    visibility: hidden !important;
  `;
  container.setAttribute("aria-hidden", "true");

  const host = document.head ?? document.body;
  if (host) {
    host.appendChild(container);
  }

  recaptchaState.container = container;
  return container;
}

function getFirebaseAuthErrorCode(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    if ("code" in error) {
      return String((error as { code?: unknown }).code ?? "");
    }
    if ("Error" in error) {
      const firebaseError = error as { Error?: { code?: string } };
      return firebaseError.Error?.code ?? "";
    }
  }
  return "";
}

function getFirebaseAuthErrorMessage(error: unknown): string {
  const code = getFirebaseAuthErrorCode(error);
  const originalMessage = error instanceof Error ? error.message : "";

  if (code === "auth/invalid-api-key") {
    return "Firebase API key is invalid or not enabled. Verify the deployed VITE_FIREBASE_* values and API key restrictions.";
  }

  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized for Firebase Phone Auth. Add the current host to Firebase Authentication authorized domains in the Firebase console.";
  }

  if (code === "auth/invalid-phone-number") {
    return "Enter a valid 10-digit Indian phone number (e.g., 9876543210).";
  }

  if (code === "auth/too-many-requests") {
    return "Too many OTP requests sent. Please wait a few minutes and try again.";
  }

  if (code === "auth/invalid-app-credential") {
    return "reCAPTCHA verification failed. This is usually a configuration issue. Please refresh the page and try again.";
  }

  if (code === "auth/captcha-check-failed") {
    return "reCAPTCHA verification failed. Please refresh the page and try again.";
  }

  if (code === "auth/network-request-failed") {
    return "Network error while sending the OTP. Check your internet connection and try again.";
  }

  if (code === "auth/quota-exceeded") {
    return "SMS quota exceeded. Please try again later or contact support.";
  }

  if (code === "auth/internal-error") {
    return "An internal error occurred. Please refresh the page and try again.";
  }

  if (originalMessage.toLowerCase().includes("recaptcha")) {
    return "reCAPTCHA verification failed. Please refresh the page and try again.";
  }

  return (
    originalMessage ||
    "Unable to complete phone authentication. Please try again."
  );
}

export function canonicalIndianPhoneNumber(phoneNumber?: string | null) {
  if (!phoneNumber) {
    return "";
  }

  const trimmed = phoneNumber.trim();
  if (trimmed.startsWith("+")) {
    return trimmed.replace(/\s+/g, "");
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  return digits ? `+${digits}` : "";
}

function clearPhoneRecaptchaVerifier() {
  try {
    recaptchaState.verifier?.clear();
  } catch {
    // Ignore cleanup failures; the verifier is being discarded anyway.
  }

  recaptchaState.verifier = null;
  recaptchaState.renderPromise = null;
  recaptchaState.renderedWidgetId = null;
}

function getRecaptchaContainer(): HTMLDivElement {
  if (recaptchaState.container?.isConnected) {
    return recaptchaState.container;
  }

  const container = ensurePhoneRecaptchaContainer();
  if (!(container instanceof HTMLDivElement)) {
    throw new Error(
      'Missing recaptcha container. The app must create <div id="recaptcha-container" /> before sending OTP.',
    );
  }

  recaptchaState.container = container;
  return container;
}

async function getPhoneRecaptchaVerifier(): Promise<RecaptchaVerifier> {
  if (recaptchaState.verifier) {
    return recaptchaState.verifier;
  }

  const auth = getFirebaseAuth();
  const container = getRecaptchaContainer();

  recaptchaState.verifier = new RecaptchaVerifier(auth, container, {
    size: "invisible",
    tabindex: 0,
  });

  return recaptchaState.verifier;
}

async function renderRecaptcha(verifier: RecaptchaVerifier): Promise<number> {
  if (recaptchaState.renderedWidgetId !== null) {
    return recaptchaState.renderedWidgetId;
  }

  if (!recaptchaState.renderPromise) {
    recaptchaState.renderPromise = verifier.render().then((widgetId) => {
      recaptchaState.renderedWidgetId = widgetId;
      return widgetId;
    });
  }

  try {
    return await recaptchaState.renderPromise;
  } catch (error) {
    recaptchaState.renderPromise = null;
    throw error;
  }
}

export async function resetPhoneRecaptchaVerifier() {
  clearPhoneRecaptchaVerifier();

  if (typeof window !== "undefined" && recaptchaState.container?.isConnected) {
    recaptchaState.container.innerHTML = "";
  }
}

export async function sendPhoneOtp(
  phoneNumber: string,
): Promise<PhoneOtpSendResult> {
  const formattedPhoneNumber = formatIndianPhoneNumber(phoneNumber);

  if (!formattedPhoneNumber) {
    throw new Error("Enter a valid 10-digit Indian phone number.");
  }

  clearPhoneRecaptchaVerifier();

  const auth = getFirebaseAuth();
  await authPersistenceReady.catch(() => undefined);

  const verifier = await getPhoneRecaptchaVerifier();

  try {
    await renderRecaptcha(verifier);

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhoneNumber,
      verifier,
    );

    return { confirmationResult, phoneNumber: formattedPhoneNumber };
  } catch (error) {
    const code = getFirebaseAuthErrorCode(error);

    if (
      code === "auth/invalid-app-credential" ||
      code === "auth/captcha-check-failed" ||
      code === "auth/too-many-requests" ||
      code === "auth/network-request-failed"
    ) {
      clearPhoneRecaptchaVerifier();
    }

    throw new Error(getFirebaseAuthErrorMessage(error));
  }
}

export async function verifyPhoneOtp(
  confirmationResult: ConfirmationResult,
  code: string,
) {
  const otpCode = code.trim();

  if (otpCode.length !== 6) {
    throw new Error("Enter the 6-digit OTP.");
  }

  try {
    return await confirmationResult.confirm(otpCode);
  } catch (error) {
    throw new Error(getFirebaseAuthErrorMessage(error));
  }
}

export function createSyncedUserFromFirebaseUser(
  firebaseUser: FirebaseUser,
): SyncedUser {
  return {
    id: firebaseUser.uid,
    firebaseUid: firebaseUser.uid,
    name: getFallbackName(firebaseUser),
    email: firebaseUser.email ?? "",
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

function readUserSettings(
  settings: Record<string, unknown> | null | undefined,
): UserSettingsRow {
  return {
    aspirantType:
      typeof settings?.aspirantType === "string" && settings.aspirantType.trim()
        ? settings.aspirantType
        : null,
    onboardingComplete:
      typeof settings?.onboardingComplete === "boolean"
        ? settings.onboardingComplete
        : true,
  };
}

async function fetchUserSettingsByFirebaseUid(firebaseUid: string) {
  const { data, error } = await supabase
    .from("users")
    .select("settings")
    .eq("firebase_uid", firebaseUid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.settings as Record<string, unknown> | null) ?? null;
}

export function normalizeIndianPhoneNumber(phoneNumber?: string | null) {
  if (!phoneNumber) {
    return "";
  }

  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length <= 10) {
    return digits.slice(0, 10);
  }

  return digits.slice(-10);
}

export function formatIndianPhoneNumber(phoneNumber: string) {
  const digits = normalizeIndianPhoneNumber(phoneNumber);
  return digits.length === 10 ? `+91${digits}` : "";
}

function getFallbackName(firebaseUser: FirebaseUser) {
  if (firebaseUser.displayName?.trim()) {
    return firebaseUser.displayName.trim();
  }

  if (firebaseUser.email?.trim()) {
    return firebaseUser.email.split("@")[0] ?? "Student";
  }

  if (firebaseUser.phoneNumber) {
    return `+91 ${normalizeIndianPhoneNumber(firebaseUser.phoneNumber)}`.trim();
  }

  return "Student";
}

function mapUserRow(row: UserRow): SyncedUser {
  const settings = readUserSettings(row.settings);

  return {
    id: row.id,
    firebaseUid: row.firebase_uid,
    name: row.name ?? "Student",
    email: row.email ?? "",
    phone: row.phone ?? "",
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

function mapStudentRecordToSyncedUser(
  student: StudentRecord,
  fallback: SyncedUser,
): SyncedUser {
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
          .from("students")
          .select(
            "id, name, full_name, email, phone, firebase_uid, aspirant_type, user_id, city, state, created_at",
          )
          .eq("phone", exactPhone)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    fallbackPhone && fallbackPhone !== exactPhone
      ? supabase
          .from("students")
          .select(
            "id, name, full_name, email, phone, firebase_uid, aspirant_type, user_id, city, state, created_at",
          )
          .eq("phone", fallbackPhone)
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

export async function fetchStudentByPhone(
  phoneNumber: string,
): Promise<StudentRecord | null> {
  const student = await queryStudentByPhone(phoneNumber);
  return student ? mapStudentRow(student) : null;
}

export async function fetchStudentByEmail(
  email: string,
): Promise<StudentRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const { data, error } = await supabase
    .from("students")
    .select(
      "id, name, full_name, email, phone, firebase_uid, aspirant_type, user_id, city, state, created_at",
    )
    .eq("email", normalizedEmail)
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
    .from("students")
    .upsert(payload, { onConflict: "phone" })
    .select(
      "id, name, full_name, email, phone, firebase_uid, aspirant_type, user_id, city, state, created_at",
    )
    .single();

  if (error) {
    throw error;
  }

  return mapStudentRow(data as StudentRow);
}

export async function syncFirebaseUserToSupabase(
  firebaseUser: FirebaseUser,
  overrides: SyncUserOverrides = {},
): Promise<SyncedUser> {
  const nextSettings =
    overrides.settings !== undefined ||
    overrides.aspirantType !== undefined ||
    overrides.onboardingComplete !== undefined
      ? {
          ...((await fetchUserSettingsByFirebaseUid(firebaseUser.uid)) ?? {}),
          ...(overrides.settings ?? {}),
          ...(overrides.aspirantType !== undefined
            ? { aspirantType: overrides.aspirantType }
            : {}),
          ...(overrides.onboardingComplete !== undefined
            ? { onboardingComplete: overrides.onboardingComplete }
            : {}),
        }
      : undefined;

  const payload = {
    firebase_uid: firebaseUser.uid,
    name: overrides.name ?? getFallbackName(firebaseUser),
    email: overrides.email ?? firebaseUser.email ?? null,
    phone:
      overrides.phone ?? canonicalIndianPhoneNumber(firebaseUser.phoneNumber),
    avatar_url: overrides.avatarUrl ?? firebaseUser.photoURL ?? null,
    ...(nextSettings ? { settings: nextSettings } : {}),
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "firebase_uid" })
    .select(
      "id, firebase_uid, name, email, phone, avatar_url, role, bio, settings, created_at, updated_at",
    )
    .single();

  if (error) {
    throw error;
  }

  return {
    ...mapUserRow(data as UserRow),
    studentId: overrides.studentId ?? null,
  };
}

export async function fetchSyncedUserByFirebaseUid(
  firebaseUid: string,
): Promise<SyncedUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, firebase_uid, name, email, phone, avatar_url, role, bio, settings, created_at, updated_at",
    )
    .eq("firebase_uid", firebaseUid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapUserRow(data as UserRow) : null;
}
