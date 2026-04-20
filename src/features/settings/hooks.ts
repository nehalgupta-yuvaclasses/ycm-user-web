import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSettingsProfile, updateLanguage, updateNotificationPreferences, updatePassword } from './api';

export function useSettingsProfile() {
  return useQuery({
    queryKey: ['settings', 'profile'],
    queryFn: fetchSettingsProfile,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLanguage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: updatePassword,
  });
}