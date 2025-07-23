import { deleteStoredInfo, useUserAuth } from '@sunrise-ui/primitives';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export default function useLogout() {
  const queryClient = useQueryClient();
  const { setHasAuthenticated } = useUserAuth();

  const logout = async () => {
    setHasAuthenticated(false);
    router.replace('/login');
    await deleteStoredInfo();
    queryClient.clear();
  };

  return { logout };
}
