import useAppState from '@contexts/useAppState';
import useNotificationService from '@contexts/useNotificationService';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function useBackgroundManager() {
  const { appState } = useAppState();
  const { notificationService } = useNotificationService();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (appState === 'background') {
      notificationService?.closeSocket();
    } else if (appState === 'active') {
      void queryClient.invalidateQueries();
      void notificationService?.openSocket();
    }
  }, [appState]);
}
