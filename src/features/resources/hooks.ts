import { useQuery } from '@tanstack/react-query';
import { fetchResources, fetchResourceById } from './api';

export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
    staleTime: 1000 * 60 * 2,
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resources', id],
    queryFn: () => fetchResourceById(id),
    enabled: !!id,
  });
}
