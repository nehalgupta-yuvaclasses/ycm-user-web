import { supabase } from '@/lib/supabaseClient';

export interface SocialsData {
  phone: string;
  email: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  linkedin: string;
  address: string;
  support_hours: string;
  id?: string;
  key?: string;
  created_at?: string;
  updated_at?: string;
}

const SOCIALS_KEY = 'socials';

export const DEFAULT_SOCIALS: SocialsData = {
  phone: '',
  email: '',
  whatsapp: '',
  telegram: '',
  instagram: '',
  facebook: '',
  twitter: '',
  youtube: '',
  linkedin: '',
  address: '',
  support_hours: '',
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const normalizeSocials = (value: unknown): SocialsData => {
  const record = value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

  return {
    ...DEFAULT_SOCIALS,
    phone: normalizeText(record.phone),
    email: normalizeText(record.email),
    whatsapp: normalizeText(record.whatsapp),
    telegram: normalizeText(record.telegram),
    instagram: normalizeText(record.instagram),
    facebook: normalizeText(record.facebook),
    twitter: normalizeText(record.twitter),
    youtube: normalizeText(record.youtube),
    linkedin: normalizeText(record.linkedin),
    address: normalizeText(record.address),
    support_hours: normalizeText(record.support_hours),
  };
};

export async function fetchSocials(): Promise<SocialsData> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('id, key, value, created_at, updated_at')
      .eq('key', SOCIALS_KEY)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error('fetchSocials error:', error);
      }
      return { ...DEFAULT_SOCIALS };
    }

    return {
      ...DEFAULT_SOCIALS,
      ...normalizeSocials(data.value),
      id: data.id,
      key: data.key,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('fetchSocials exception:', error);
    return { ...DEFAULT_SOCIALS };
  }
}

export function isSocialLink(value: string | undefined | null) {
  return Boolean(value && value.trim());
}

export function formatPhoneHref(phone: string) {
  return phone.replace(/\s+/g, '');
}