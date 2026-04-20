import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  subscribeToNewsletter,
  validateSubscriberForm,
  type SubscriberFormErrors,
} from '@/services/messages';

export function FinalCTA() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [honeypot, setHoneypot] = React.useState('');
  const [errors, setErrors] = React.useState<SubscriberFormErrors>({});
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSubscriberForm({ email, honeypot });
    setErrors(validation.errors);

    if (!validation.isValid) {
      toast.error(validation.errors.general ?? validation.errors.email ?? 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await subscribeToNewsletter({ email: validation.values.email, honeypot });

      if (result.status === 'ignored') {
        return;
      }

      if (result.status === 'already-subscribed') {
        toast.info('You are already subscribed!');
        setEmail('');
        setSuccessMessage('You are already on the newsletter list.');
        return;
      }

      toast.success('Thank you for subscribing!');
      setEmail('');
      setHoneypot('');
      setErrors({});
      setSuccessMessage('You are now subscribed to updates and exam news.');
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast.error(`Subscription failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-zinc-50 border-t border-zinc-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-left max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
              Stay Updated with Exam News
            </h2>
            <p className="text-zinc-600">
              Get the latest exam notifications, study material, and preparation tips directly in your inbox.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex-1 max-w-md">
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-12 bg-white border-zinc-200 focus:ring-zinc-900"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSuccessMessage('');
                  setErrors((current) => ({ ...current, email: undefined, general: undefined }));
                }}
                disabled={isSubmitting}
              />
              <Button 
                type="submit"
                className="bg-zinc-900 text-white hover:bg-zinc-800 h-12 px-8 font-bold gap-2 shrink-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                <Send className="w-4 h-4" />
              </Button>
            </form>
            {errors.email && <p className="mt-2 text-xs font-medium text-red-500">{errors.email}</p>}
            {successMessage && <p className="mt-3 text-sm font-medium text-emerald-600">{successMessage}</p>}
            <p className="mt-3 text-[10px] text-zinc-400 text-center md:text-left">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
