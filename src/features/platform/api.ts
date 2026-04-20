import { supabase } from '@/lib/supabaseClient';

export interface Banner {
  id: string;
  title: string | null;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

export async function fetchBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}
