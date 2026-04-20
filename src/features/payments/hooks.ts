import { useQuery } from '@tanstack/react-query';
import { fetchPaymentById, fetchPaymentsOverview } from './api';

export function usePaymentsOverview() {
  return useQuery({
    queryKey: ['payments', 'overview'],
    queryFn: fetchPaymentsOverview,
    staleTime: 1000 * 60 * 2,
  });
}

export function usePaymentDetail(id: string) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => fetchPaymentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}