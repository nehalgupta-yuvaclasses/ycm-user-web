import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ChevronLeft, Loader2, Mail, Phone, RefreshCw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthModal } from '@/contexts/AuthContext';
import { normalizeIndianPhoneNumber } from '@/services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'phone' | 'email';
type PhoneStep = 'entry' | 'otp';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const navigate = useNavigate();
  const { loginWithPhone, loginWithEmail, loginWithGoogle } = useAuthModal();
  const [mode, setMode] = React.useState<AuthMode>('phone');
  const [phoneStep, setPhoneStep] = React.useState<PhoneStep>('entry');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const otpInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      const timeout = window.setTimeout(() => {
        setMode('phone');
        setPhoneStep('entry');
        setPhoneNumber('');
        setOtpCode('');
        setEmail('');
        setPassword('');
        setResendTimer(0);
        setIsSubmitting(false);
        setError(null);
      }, 180);

      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [isOpen]);

  React.useEffect(() => {
    if (phoneStep === 'otp') {
      window.requestAnimationFrame(() => {
        otpInputRef.current?.focus();
      });
    }
  }, [phoneStep]);

  React.useEffect(() => {
    if (resendTimer <= 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setResendTimer((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendTimer]);

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(normalizeIndianPhoneNumber(value));
  };

  const resetModeState = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPhoneStep('entry');
    setOtpCode('');
    setError(null);
    setResendTimer(0);
  };

  const startPhoneVerification = async () => {
    setError(null);

    if (phoneNumber.length !== 10) {
      setError('Enter a valid 10-digit Indian phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithPhone(phoneNumber);
      setPhoneStep('otp');
      setResendTimer(30);
      toast.success('Verification code sent.');
    } catch (phoneError) {
      const message = phoneError instanceof Error ? phoneError.message : 'Unable to continue with phone verification.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishPhoneVerification = async () => {
    setError(null);

    if (otpCode.trim().length !== 6) {
      setError('Enter the 6-digit OTP.');
      return;
    }

    setIsSubmitting(true);
    try {
      const signedInUser = await loginWithPhone(phoneNumber, otpCode.trim());
      onClose();

      if (!('verificationId' in signedInUser) && signedInUser.onboardingComplete) {
        navigate('/dashboard');
      }
    } catch (phoneError) {
      const message = phoneError instanceof Error ? phoneError.message : 'Unable to verify the OTP.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const signedInUser = await loginWithGoogle();
      onClose();

      if (signedInUser.onboardingComplete) {
        navigate('/dashboard');
      }
    } catch (googleError) {
      const message = googleError instanceof Error ? googleError.message : 'Unable to continue with Google.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEmailLogin = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const signedInUser = await loginWithEmail(email, password);
      onClose();

      if (signedInUser.onboardingComplete) {
        navigate('/dashboard');
      }
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : 'Unable to continue with email and password.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    !isSubmitting &&
    ((mode === 'phone' && phoneStep === 'entry' && phoneNumber.length === 10) ||
      (mode === 'phone' && phoneStep === 'otp' && otpCode.trim().length === 6) ||
      (mode === 'email' && Boolean(email.trim()) && Boolean(password.trim())));

  const handlePrimarySubmit = async () => {
    if (mode === 'phone' && phoneStep === 'entry') {
      await startPhoneVerification();
      return;
    }

    if (mode === 'phone') {
      await finishPhoneVerification();
      return;
    }

    await submitEmailLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md overflow-hidden border border-zinc-200 bg-white p-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)]">
        <div className="relative flex max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(24,24,27,0.08),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,248,250,0.96))]" />
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-zinc-200/40 blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full border border-zinc-200 bg-white/90 p-2 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            <X className="size-4" />
          </button>

          <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
            <div className="space-y-6">
              <div className="space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm">
                  <span className="flex size-8 items-center justify-center rounded-full bg-zinc-900 text-white">
                    <Phone className="size-4" />
                  </span>
                  Yuva Classes
                </div>

                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">Continue to Yuva Classes</DialogTitle>
                  <DialogDescription className="text-sm text-zinc-600 sm:text-base">Login or create your account</DialogDescription>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === 'phone' ? (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Phone Number</label>
                      <div className="flex h-14 items-stretch overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm focus-within:border-zinc-900 focus-within:ring-4 focus-within:ring-zinc-900/5">
                        <div className="flex items-center border-r border-zinc-200 px-4 text-sm font-bold text-zinc-900">+91</div>
                        <Input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          placeholder="9876543210"
                          value={phoneNumber}
                          onChange={(event) => handlePhoneChange(event.target.value)}
                          className="h-full border-0 bg-transparent px-4 text-base tracking-[0.25em] shadow-none focus-visible:ring-0"
                          maxLength={10}
                          disabled={isSubmitting || phoneStep === 'otp'}
                        />
                      </div>
                    </div>

                    {phoneStep === 'otp' ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Verification Code</label>
                          <Input
                            ref={otpInputRef}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="000000"
                            value={otpCode}
                            onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="h-14 rounded-2xl border-zinc-200 bg-white px-4 text-center text-lg font-bold tracking-[0.35em] shadow-sm focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                            maxLength={6}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                          <button
                            type="button"
                            onClick={() => {
                              setPhoneStep('entry');
                              setOtpCode('');
                              setResendTimer(0);
                            }}
                            className="inline-flex items-center gap-1.5 transition hover:text-zinc-900"
                            disabled={isSubmitting}
                          >
                            <ChevronLeft className="size-3" />
                            Change number
                          </button>

                          {resendTimer > 0 ? (
                            <span>Resend in {resendTimer}s</span>
                          ) : (
                            <button type="button" onClick={() => void startPhoneVerification()} className="inline-flex items-center gap-1.5 transition hover:text-zinc-900" disabled={isSubmitting}>
                              <RefreshCw className="size-3" />
                              Resend
                            </button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                ) : (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Email</label>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-14 rounded-2xl border-zinc-200 bg-white px-4 shadow-sm focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Password</label>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-14 rounded-2xl border-zinc-200 bg-white px-4 shadow-sm focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                        disabled={isSubmitting}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error ? (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <div className="space-y-4 pt-1">
                <div className="relative">
                  <Separator className="bg-zinc-200" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    or
                  </span>
                </div>

                <Button type="button" variant="outline" onClick={() => void handleGoogleLogin()} disabled={isSubmitting} className="h-12 w-full rounded-2xl border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50">
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <GoogleMark />}
                  Continue with Google
                </Button>

                <button
                  type="button"
                  onClick={() => resetModeState(mode === 'phone' ? 'email' : 'phone')}
                  className="text-sm font-semibold text-zinc-900 transition hover:underline"
                  disabled={isSubmitting}
                >
                  {mode === 'phone' ? 'Use email instead' : 'Use phone instead'}
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0 border-t border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur sm:px-8">
            <Button type="button" onClick={() => void handlePrimarySubmit()} disabled={!canSubmit} className="h-14 w-full rounded-2xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800">
              {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : 'Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
