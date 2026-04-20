import { useQuery } from '@tanstack/react-query';
import { fetchBanners, fetchFAQs } from './api';

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  });
}

export function useFAQs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFAQs,
  });
}
