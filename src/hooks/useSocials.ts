import { useQuery } from '@tanstack/react-query';
import { DEFAULT_SOCIALS, fetchSocials } from '@/services/socialsService';

export const socialsQueryKey = ['site-settings', 'socials'];

export function useSocials() {
  return useQuery({
    queryKey: socialsQueryKey,
    queryFn: fetchSocials,
    placeholderData: DEFAULT_SOCIALS,
    staleTime: 1000 * 60 * 10,
  });
}