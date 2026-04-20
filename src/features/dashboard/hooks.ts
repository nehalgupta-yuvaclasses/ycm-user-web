import { useQuery } from '@tanstack/react-query';
import { fetchDashboardIdentity, fetchStudentDashboard } from './api';

type DashboardQueryOptions = {
  enabled?: boolean;
};

export function useDashboardIdentity(options: DashboardQueryOptions = {}) {
  return useQuery({
    queryKey: ['dashboard', 'identity'],
    queryFn: fetchDashboardIdentity,
    staleTime: 1000 * 60 * 5,
    enabled: options.enabled ?? true,
  });
}

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: fetchStudentDashboard,
    staleTime: 1000 * 60 * 2,
  });
}