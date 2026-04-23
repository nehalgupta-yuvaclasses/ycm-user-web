import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, RefreshCcw, ShieldCheck, XCircle } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthContext';
import { useCourse } from '@/features/courses/hooks';
import { useCourseEnrollment } from '@/features/courses/hooks';
import { createRazorpayOrder, fetchPublicPaymentSettings, verifyRazorpayPayment } from '@/features/payments/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, handler: () => void) => void };
  }
}

type CheckoutState = 'loading' | 'ready' | 'processing' | 'success' | 'error';

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

async function loadRazorpayScript() {
  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, firebaseUser, openAuthModal } = useAuthModal();
  const { data: course, isLoading: isLoadingCourse, isError } = useCourse(courseId || '');
  const { data: enrollment } = useCourseEnrollment(courseId || '', user?.firebaseUid ?? null, user?.studentId ?? null);
  const [state, setState] = useState<CheckoutState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [gstRate, setGstRate] = useState(18);
  const [isLaunching, setIsLaunching] = useState(false);

  const totalAmount = useMemo(() => {
    if (!course) {
      return 0;
    }

    const baseAmount = Number(course.selling_price ?? course.buying_price ?? 0);
    const gstAmount = Math.round((baseAmount * gstRate) / 100);
    return baseAmount + gstAmount;
  }, [course, gstRate]);

  useEffect(() => {
    async function bootstrap() {
      if (!courseId) {
        setState('error');
        setErrorMessage('Invalid course selected.');
        return;
      }

      if (enrollment) {
        setState('success');
        setErrorMessage('You are already enrolled in this course.');
        return;
      }

      if (!user) {
        setState('ready');
        return;
      }

      try {
        const firebaseToken = await firebaseUser?.getIdToken(true);
        const settings = await fetchPublicPaymentSettings(firebaseToken ? { Authorization: `Bearer ${firebaseToken}` } : undefined);
        setGstRate(settings.gstRate || 18);

        if (!settings.isEnabled) {
          setState('error');
          setErrorMessage('Payments are currently disabled by the admin team.');
          return;
        }

        setState('ready');
      } catch (paymentError) {
        setState('error');
        setErrorMessage(paymentError instanceof Error ? paymentError.message : 'Failed to load payment configuration.');
      }
    }

    void bootstrap();
  }, [courseId, enrollment, user, firebaseUser]);

  async function startCheckout() {
    if (!user) {
      openAuthModal();
      return;
    }

    if (!course) {
      setState('error');
      setErrorMessage('Course details are not available yet.');
      return;
    }

    if (enrollment) {
      navigate(`/course/${course.id}`);
      return;
    }

    setIsLaunching(true);
    setState('processing');
    setErrorMessage('');

    try {
      const firebaseToken = await firebaseUser?.getIdToken(true);
      const isRazorpayReady = await loadRazorpayScript();
      if (!isRazorpayReady || !window.Razorpay) {
        throw new Error('Razorpay checkout failed to load.');
      }

      const order = await createRazorpayOrder({
        courseId: course.id,
        amount: totalAmount,
      }, firebaseToken ? { Authorization: `Bearer ${firebaseToken}` } : undefined);

      const checkout = new window.Razorpay({
        key: order.apiKey,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: 'Yuva Classes',
        description: order.courseTitle,
        order_id: order.orderId,
        theme: {
          color: '#111827',
        },
        prefill: {
          name: user.displayName ?? user.user_metadata?.full_name ?? user.email ?? '',
          email: user.email ?? '',
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            await verifyRazorpayPayment(response, firebaseToken ? { Authorization: `Bearer ${firebaseToken}` } : undefined);
            setState('success');
            navigate('/dashboard/courses', { replace: true });
          } catch (verificationError) {
            setState('error');
            setErrorMessage(verificationError instanceof Error ? verificationError.message : 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => {
            setState('ready');
          },
        },
      });

      checkout.on('payment.failed', () => {
        setState('error');
        setErrorMessage('Payment was not completed. Please try again.');
      });

      checkout.open();
    } catch (checkoutError) {
      setState('error');
      setErrorMessage(checkoutError instanceof Error ? checkoutError.message : 'Unable to start checkout.');
    } finally {
      setIsLaunching(false);
    }
  }

  if (isLoadingCourse || state === 'loading') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-zinc-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Preparing checkout...
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-white px-4 text-center">
        <XCircle className="h-10 w-10 text-zinc-300" />
        <p className="text-lg font-semibold text-zinc-900">Course not available</p>
        <p className="max-w-md text-sm text-zinc-500">We could not load this checkout page.</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(17,24,39,0.06),_transparent_36%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-8 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2 px-0 text-zinc-600 hover:text-zinc-900" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Secure payment via Razorpay
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <Card className="overflow-hidden border-zinc-200/80 bg-white/90 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Checkout</p>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">{course.title}</h1>
                <p className="max-w-2xl text-sm leading-6 text-zinc-600">
                  Complete your enrollment securely. Your payment will be verified by the backend before access is unlocked.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Base price</p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">{formatMoney(Number(course.selling_price ?? course.buying_price ?? 0))}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">GST</p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">{gstRate}%</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Total</p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">{formatMoney(totalAmount)}</p>
                </div>
              </div>

              {state === 'error' ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium">Checkout failed</p>
                      <p className="mt-1 text-red-600">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {state === 'success' ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium">Payment verified</p>
                      <p className="mt-1 text-emerald-600">Your course access has been unlocked.</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="h-12 gap-2 rounded-xl px-6" onClick={startCheckout} disabled={isLaunching || state === 'processing' || Boolean(enrollment)}>
                  {isLaunching || state === 'processing' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {enrollment ? 'Open course' : user ? 'Pay now' : 'Sign in to continue'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-12 rounded-xl px-6" onClick={() => navigate(`/course/${course.id}`)}>
                  Review course
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 bg-zinc-950 text-white shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)]">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Order summary</p>
                <p className="mt-2 text-2xl font-bold">{formatMoney(totalAmount)}</p>
              </div>
              <div className="space-y-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Course</span>
                  <span className="font-medium text-white">{course.title}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Gateway</span>
                  <span className="font-medium text-white">Razorpay</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Verification</span>
                  <span className="font-medium text-white">Backend signed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Retry</span>
                  <Button variant="ghost" className="h-8 gap-2 px-0 text-white hover:bg-white/10 hover:text-white" onClick={startCheckout}>
                    <RefreshCcw className="h-4 w-4" />
                    Retry checkout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}