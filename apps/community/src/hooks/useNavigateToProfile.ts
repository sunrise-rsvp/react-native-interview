import { useUserAuth } from '@sunrise-ui/primitives';
import { router } from 'expo-router';

export default function useNavigateToProfile(profileId?: string) {
  const { currentUserId } = useUserAuth();
  return () => {
    if (!profileId) return;

    if (profileId === currentUserId) router.navigate('/profile');
    else router.navigate(`/to/${profileId}`);
  };
}
