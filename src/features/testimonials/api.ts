import { supabase } from '@/lib/supabaseClient';
import { TESTIMONIALS } from '@/constants';
import { Testimonial, Achiever } from './types';

function mapSeedTestimonials(): Testimonial[] {
  return TESTIMONIALS.map((testimonial, index) => ({
    id: testimonial.id,
    name: testimonial.name,
    content: testimonial.content,
    rating: testimonial.rating,
    course_id: null,
    created_at: new Date(Date.UTC(2024, 0, index + 1)).toISOString(),
  }));
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return mapSeedTestimonials();
}

export async function fetchAchievers(): Promise<Achiever[]> {
  const { data, error } = await supabase
    .from('results')
    .select('id, student_name, exam, rank, image_url, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    name: item.student_name,
    score: item.rank,
    exam: item.exam,
    year: new Date(item.created_at).getFullYear(),
    image_url: item.image_url,
    created_at: item.created_at
  }));
}
