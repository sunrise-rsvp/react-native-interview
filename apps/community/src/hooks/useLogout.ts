import { deleteStoredInfo, useUserAuth } from '@sunrise-ui/primitives';
import { useQueryClient } from '@tanstack/react-query';
import { CustomerIO } from '@utils/CustomerIO';
import { router } from 'expo-router';

export default function useLogout() {
  const queryClient = useQueryClient();
  const { setHasAuthenticated } = useUserAuth();

  const logout = async () => {
    if (CustomerIO) {
      await CustomerIO.clearIdentify();
    }
    setHasAuthenticated(false);
    router.replace('/login');
    await deleteStoredInfo();
    queryClient.clear();
  };

  return { logout };
}
