import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthModal } from '@/contexts/AuthContext';

const ASPIRANT_TYPES = ['SSC Aspirant', 'BPSC Aspirant', 'Competitive Exams', 'Others'] as const;

type AspirantType = (typeof ASPIRANT_TYPES)[number];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function OnboardingModal() {
  const navigate = useNavigate();
  const { firebaseUser, isOnboardingModalOpen, closeOnboardingModal, openOnboardingModal, completeOnboarding, user } = useAuthModal();
  const isPhoneAuth = Boolean(firebaseUser?.phoneNumber);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [aspirantType, setAspirantType] = React.useState<AspirantType | ''>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOnboardingModalOpen) {
      const timeout = window.setTimeout(() => {
        setFullName('');
        setEmail('');
        setPhone('');
        setAspirantType('');
        setIsSubmitting(false);
        setError(null);
      }, 180);

      return () => window.clearTimeout(timeout);
    }

    setFullName(user?.name?.trim() || firebaseUser?.displayName?.trim() || '');
    setEmail(user?.email?.trim() || firebaseUser?.email?.trim() || '');
    setPhone(user?.phone?.trim() || firebaseUser?.phoneNumber?.trim() || '');
    setAspirantType((user?.aspirantType as AspirantType | '') || '');
    setError(null);

    return undefined;
  }, [firebaseUser?.displayName, firebaseUser?.email, firebaseUser?.phoneNumber, isOnboardingModalOpen, user?.aspirantType, user?.email, user?.name, user?.phone]);

  const nameIsValid = fullName.trim().length >= 3;
  const emailIsValid = isPhoneAuth ? isValidEmail(email) : Boolean(email.trim()) || Boolean(firebaseUser?.email);
  const aspirantIsValid = Boolean(aspirantType);
  const canSubmit = nameIsValid && emailIsValid && aspirantIsValid && !isSubmitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!nameIsValid) {
      setError('Enter your full name with at least 3 characters.');
      return;
    }

    if (!emailIsValid) {
      setError('Enter a valid email address.');
      return;
    }

    if (!aspirantIsValid) {
      setError('Select an aspirant type.');
      return;
    }

    setIsSubmitting(true);

    try {
      await completeOnboarding({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: isPhoneAuth ? phone.trim() : undefined,
        aspirantType,
      });
      toast.success('Profile completed.');
      closeOnboardingModal();
      navigate('/dashboard');
    } catch (onboardingError) {
      const message = onboardingError instanceof Error ? onboardingError.message : 'Unable to complete your profile.';
      setError(message);
      toast.error(message);
      openOnboardingModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOnboardingModalOpen}
      onOpenChange={(open) => {
        if (open) {
          openOnboardingModal();
          return;
        }

        if (user?.onboardingComplete) {
          closeOnboardingModal();
        } else {
          openOnboardingModal();
        }
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-md overflow-hidden border border-zinc-200 bg-white p-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)]">
        <div className="relative flex max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(24,24,27,0.08),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,248,250,0.96))]" />
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-zinc-200/40 blur-3xl" />

          <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
            <div className="space-y-6">
              <div className="space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm">
                  <span className="flex size-8 items-center justify-center rounded-full bg-zinc-900 text-white">
                    <UserRound className="size-4" />
                  </span>
                  Complete your profile
                </div>

                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">Finish setup to continue</DialogTitle>
                  <DialogDescription className="text-sm text-zinc-600 sm:text-base">We only need a few details to personalize your Yuva Classes account.</DialogDescription>
                </div>
              </div>

              <form id="onboarding-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-14 rounded-2xl border-zinc-200 bg-white px-4 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 focus:text-zinc-900"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-14 rounded-2xl border-zinc-200 bg-white px-4 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 focus:text-zinc-900"
                    disabled={isSubmitting || (!isPhoneAuth && Boolean(firebaseUser?.email))}
                    readOnly={!isPhoneAuth && Boolean(firebaseUser?.email)}
                  />
                  {!isPhoneAuth ? <p className="text-xs text-zinc-500">This is used for account recovery and future login.</p> : null}
                </div>

                {isPhoneAuth ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      readOnly
                      className="h-14 rounded-2xl border-zinc-200 bg-zinc-50 px-4 text-zinc-900 shadow-sm focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 focus:text-zinc-900"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-zinc-500">Verified phone numbers cannot be edited here.</p>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="aspirant-type" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Aspirant Type</Label>
                  <Select value={aspirantType} onValueChange={(value) => setAspirantType(value as AspirantType)} disabled={isSubmitting}>
                    <SelectTrigger id="aspirant-type" className="h-14 w-full rounded-2xl border-zinc-200 bg-white px-4 text-left text-zinc-900 shadow-sm ring-0 focus:ring-4 focus:ring-zinc-900/5 data-placeholder:text-zinc-400">
                      <SelectValue placeholder="Select aspirant type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-zinc-100 p-1.5 shadow-2xl">
                      {ASPIRANT_TYPES.map((option) => (
                        <SelectItem key={option} value={option} className="rounded-xl py-3 font-medium focus:bg-zinc-900 focus:text-white">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error ? (
                  <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : null}
              </form>
            </div>
          </div>

          <div className="relative z-10 shrink-0 border-t border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur sm:px-8">
            <Button type="submit" form="onboarding-form" disabled={!canSubmit} className="h-14 w-full rounded-2xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800">
              {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : 'Complete Profile'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
