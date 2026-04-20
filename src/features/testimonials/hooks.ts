import { useQuery } from '@tanstack/react-query';
import { fetchTestimonials, fetchAchievers } from './api';

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
  });
}

export function useAchievers() {
  return useQuery({
    queryKey: ['achievers'],
    queryFn: fetchAchievers,
  });
}
