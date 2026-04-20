import { useQuery } from '@tanstack/react-query';
import { fetchTestSeriesOverview } from './api';

export function useTestSeriesOverview() {
  return useQuery({
    queryKey: ['tests', 'overview'],
    queryFn: fetchTestSeriesOverview,
    staleTime: 1000 * 60 * 2,
  });
}