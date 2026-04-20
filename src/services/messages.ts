import { supabase } from '@/lib/supabaseClient';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactFormValues = {
  full_name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
};

export type ContactFormErrors = Partial<
  Record<'full_name' | 'email' | 'subject' | 'message' | 'general', string>
>;

export type SubscriberFormValues = {
  email: string;
  honeypot?: string;
};

export type SubscriberFormErrors = Partial<Record<'email' | 'general', string>>;

export type ContactSubmissionResult = {
  status: 'sent' | 'ignored';
};

export type NewsletterSubscriptionResult = {
  status: 'subscribed' | 'already-subscribed' | 'ignored';
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

function getSupabaseErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const code = String((error as { code?: unknown }).code ?? '');

    if (code === '23505') {
      return 'This email is already subscribed.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function validateContactForm(input: ContactFormValues) {
  const values = {
    full_name: input.full_name.trim(),
    email: normalizeEmail(input.email),
    subject: input.subject.trim(),
    message: input.message.trim(),
  };

  const errors: ContactFormErrors = {};

  if (!values.full_name) {
    errors.full_name = 'Enter your full name.';
  } else if (values.full_name.length < 2) {
    errors.full_name = 'Full name should be at least 2 characters.';
  }

  if (!values.email) {
    errors.email = 'Enter your email address.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.subject) {
    errors.subject = 'Enter a subject.';
  } else if (values.subject.length < 3) {
    errors.subject = 'Subject should be at least 3 characters.';
  }

  if (!values.message) {
    errors.message = 'Enter your message.';
  } else if (values.message.length < 10) {
    errors.message = 'Message should be at least 10 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    values,
    errors,
  };
}

export function validateSubscriberForm(input: SubscriberFormValues) {
  const email = normalizeEmail(input.email);
  const errors: SubscriberFormErrors = {};

  if (!email) {
    errors.email = 'Enter your email address.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    values: { email },
    errors,
  };
}

export async function submitContactMessage(input: ContactFormValues): Promise<ContactSubmissionResult> {
  if (input.honeypot?.trim()) {
    return { status: 'ignored' };
  }

  const validation = validateContactForm(input);

  if (!validation.isValid) {
    const message = validation.errors.general ?? validation.errors.message ?? validation.errors.email ?? validation.errors.full_name ?? validation.errors.subject ?? 'Invalid form data.';
    throw new Error(message);
  }

  const { error } = await supabase.from('contact_messages').insert([
    {
      full_name: validation.values.full_name,
      email: validation.values.email,
      subject: validation.values.subject,
      message: validation.values.message,
      status: 'new',
    },
  ]);

  if (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }

  return { status: 'sent' };
}

export async function subscribeToNewsletter(input: SubscriberFormValues): Promise<NewsletterSubscriptionResult> {
  if (input.honeypot?.trim()) {
    return { status: 'ignored' };
  }

  const validation = validateSubscriberForm(input);

  if (!validation.isValid) {
    throw new Error(validation.errors.general ?? validation.errors.email ?? 'Invalid email address.');
  }

  const { error } = await supabase.from('subscribers').insert([
    {
      email: validation.values.email,
      status: 'active',
    },
  ]);

  if (error) {
    const message = getSupabaseErrorMessage(error);

    if (message === 'This email is already subscribed.') {
      return { status: 'already-subscribed' };
    }

    throw new Error(message);
  }

  return { status: 'subscribed' };
}