import * as React from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type ConfirmationResult,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, authPersistenceReady } from '@/lib/firebase';
import {
  createSyncedUserFromFirebaseUser,
  canonicalIndianPhoneNumber,
  fetchStudentByEmail,
  fetchStudentByPhone,
  fetchSyncedUserByFirebaseUid,
  sendPhoneOtp,
  syncFirebaseUserToSupabase,
  upsertStudentOnboarding,
  verifyPhoneOtp,
  type StudentOnboardingInput,
  type SyncedUser,
} from '@/services/authService';

interface AuthContextType {
  user: SyncedUser | null;
  appUser: SyncedUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  isOnboardingModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  loginWithPhone: (phoneNumber: string, otpCode?: string) => Promise<SyncedUser | { verificationId: string }>;
  loginWithEmail: (email: string, password: string) => Promise<SyncedUser>;
  loginWithGoogle: () => Promise<SyncedUser>;
  completeOnboarding: (values: StudentOnboardingInput) => Promise<SyncedUser>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function getFirebaseAuthErrorMessage(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: unknown }).code ?? '') : '';

  if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Invalid email or password.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Popup blocked. Allow pop-ups and try Google sign-in again.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Google sign-in was interrupted. Try again.';
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in was closed before completion.';
  }

  return error instanceof Error ? error.message : 'Unable to complete authentication.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [appUser, setAppUser] = React.useState<SyncedUser | null>(null);
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = React.useState(false);
  const confirmationResultRef = React.useRef<ConfirmationResult | null>(null);
  const pendingPhoneNumberRef = React.useRef<string | null>(null);

  const openAuthModal = React.useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = React.useCallback(() => setIsAuthModalOpen(false), []);
  const openOnboardingModal = React.useCallback(() => setIsOnboardingModalOpen(true), []);
  const closeOnboardingModal = React.useCallback(() => setIsOnboardingModalOpen(false), []);

  const resolveFirebaseSession = React.useCallback(async (nextFirebaseUser: FirebaseUser) => {
    const phoneNumber = canonicalIndianPhoneNumber(nextFirebaseUser.phoneNumber);
    const email = nextFirebaseUser.email?.trim().toLowerCase() ?? '';

    const [existingUser, phoneStudent, emailStudent] = await Promise.all([
      fetchSyncedUserByFirebaseUid(nextFirebaseUser.uid),
      phoneNumber ? fetchStudentByPhone(phoneNumber) : Promise.resolve(null),
      email ? fetchStudentByEmail(email) : Promise.resolve(null),
    ]);

    const matchedStudent = phoneStudent ?? emailStudent;

    if (matchedStudent) {
      const syncedUser = await syncFirebaseUserToSupabase(nextFirebaseUser, {
        name: matchedStudent.name?.trim() || matchedStudent.full_name?.trim() || undefined,
        email: matchedStudent.email?.trim() || nextFirebaseUser.email || undefined,
        phone: matchedStudent.phone ? canonicalIndianPhoneNumber(matchedStudent.phone) : phoneNumber || null,
        studentId: matchedStudent.id,
        aspirantType: matchedStudent.aspirant_type,
        onboardingComplete: true,
      });

      setIsOnboardingModalOpen(false);
      return syncedUser;
    }

    if (existingUser?.onboardingComplete) {
      const syncedUser = await syncFirebaseUserToSupabase(nextFirebaseUser, {
        name: existingUser.name?.trim() || undefined,
        email: existingUser.email?.trim() || nextFirebaseUser.email || undefined,
        phone: existingUser.phone?.trim() || phoneNumber || null,
        aspirantType: existingUser.aspirantType,
        onboardingComplete: true,
      });

      setIsOnboardingModalOpen(false);
      return syncedUser;
    }

    const fallbackUser = await syncFirebaseUserToSupabase(nextFirebaseUser, {
      name: existingUser?.name?.trim() || nextFirebaseUser.displayName?.trim() || undefined,
      email: existingUser?.email?.trim() || nextFirebaseUser.email || null,
      phone: phoneNumber || null,
      onboardingComplete: false,
    });

    setIsOnboardingModalOpen(true);
    return fallbackUser;
  }, []);

  React.useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, async (nextFirebaseUser) => {
      if (!isActive) {
        return;
      }

      setFirebaseUser(nextFirebaseUser);

      if (!nextFirebaseUser) {
        setAppUser(null);
        confirmationResultRef.current = null;
        pendingPhoneNumberRef.current = null;
        setIsAuthModalOpen(false);
        setIsOnboardingModalOpen(false);
        setLoading(false);
        return;
      }

      try {
        const syncedUser = await resolveFirebaseSession(nextFirebaseUser);
        if (isActive) {
          setAppUser(syncedUser);
          setIsOnboardingModalOpen(!syncedUser.onboardingComplete);
        }
      } catch (error) {
        console.error('Failed to sync Firebase user to Supabase', error);
        if (isActive) {
          const fallbackUser = createSyncedUserFromFirebaseUser(nextFirebaseUser);
          setAppUser({ ...fallbackUser, onboardingComplete: false });
          setIsOnboardingModalOpen(true);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [resolveFirebaseSession]);

  const loginWithPhone = React.useCallback(async (phoneNumber: string, otpCode?: string) => {
    if (!otpCode) {
      const { confirmationResult } = await sendPhoneOtp(phoneNumber);
      confirmationResultRef.current = confirmationResult;
      pendingPhoneNumberRef.current = canonicalIndianPhoneNumber(phoneNumber);
      return { verificationId: confirmationResult.verificationId };
    }

    const formattedPhoneNumber = canonicalIndianPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      throw new Error('Enter a valid 10-digit Indian phone number.');
    }

    if (!confirmationResultRef.current || pendingPhoneNumberRef.current !== formattedPhoneNumber) {
      throw new Error('Request a new OTP before verifying the code.');
    }

    const result = await verifyPhoneOtp(confirmationResultRef.current, otpCode);
    const syncedUser = await resolveFirebaseSession(result.user);
    confirmationResultRef.current = null;
    pendingPhoneNumberRef.current = null;
    setFirebaseUser(result.user);
    setAppUser(syncedUser);
    return syncedUser;
  }, [resolveFirebaseSession]);

  const loginWithEmail = React.useCallback(async (email: string, password: string) => {
    await authPersistenceReady.catch(() => undefined);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      throw new Error('Enter a valid email address.');
    }

    if (!password.trim()) {
      throw new Error('Enter your password.');
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const syncedUser = await resolveFirebaseSession(credential.user);
      setAppUser(syncedUser);
      return syncedUser;
    } catch (error) {
      throw new Error(getFirebaseAuthErrorMessage(error));
    }
  }, [resolveFirebaseSession]);

  const loginWithGoogle = React.useCallback(async () => {
    await authPersistenceReady.catch(() => undefined);

    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const syncedUser = await resolveFirebaseSession(credential.user);
      setAppUser(syncedUser);
      return syncedUser;
    } catch (error) {
      throw new Error(getFirebaseAuthErrorMessage(error));
    }
  }, [resolveFirebaseSession]);

  const completeOnboarding = React.useCallback(async (values: StudentOnboardingInput) => {
    const currentFirebaseUser = auth.currentUser;

    if (!currentFirebaseUser) {
      throw new Error('You must be signed in to complete onboarding.');
    }

    const phoneNumber = canonicalIndianPhoneNumber(values.phone ?? currentFirebaseUser.phoneNumber);
    const normalizedEmail = values.email.trim().toLowerCase();
    const currentEmail = currentFirebaseUser.email?.trim().toLowerCase() ?? '';

    if (phoneNumber) {
      await upsertStudentOnboarding(currentFirebaseUser.uid, phoneNumber, {
        ...values,
        email: normalizedEmail || currentEmail,
        phone: phoneNumber,
      });
    }

    const syncedUser = await syncFirebaseUserToSupabase(currentFirebaseUser, {
      name: values.fullName.trim(),
      email: normalizedEmail || currentEmail || null,
      phone: phoneNumber || null,
      aspirantType: values.aspirantType,
      onboardingComplete: true,
    });

    setAppUser(syncedUser);
    setIsOnboardingModalOpen(false);
    return syncedUser;
  }, []);

  const logout = React.useCallback(async () => {
    setAppUser(null);
    confirmationResultRef.current = null;
    pendingPhoneNumberRef.current = null;
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(false);
    await signOut(auth);
    setFirebaseUser(null);
  }, []);

  const value = React.useMemo<AuthContextType>(
    () => ({
      user: appUser,
      appUser,
      firebaseUser,
      loading,
      isAuthModalOpen,
      isOnboardingModalOpen,
      openAuthModal,
      closeAuthModal,
      openOnboardingModal,
      closeOnboardingModal,
      loginWithPhone,
      loginWithEmail,
      loginWithGoogle,
      completeOnboarding,
      logout,
    }),
    [
      appUser,
      closeAuthModal,
      closeOnboardingModal,
      completeOnboarding,
      firebaseUser,
      isAuthModalOpen,
      isOnboardingModalOpen,
      loading,
      loginWithEmail,
      loginWithGoogle,
      loginWithPhone,
      logout,
      openAuthModal,
      openOnboardingModal,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthModal() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthProvider');
  }
  return context;
}

export function useAuth() {
  return useAuthModal();
}
