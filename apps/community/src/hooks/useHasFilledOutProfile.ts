import { useGetProfile } from '@queries/profiles';
import { useUserAuth } from '@sunrise-ui/primitives';

export function useHasFilledOutProfile() {
  const { currentUserId, hasAuthenticated } = useUserAuth();
  const { isLoading, data: profile } = useGetProfile(
    currentUserId,
    hasAuthenticated,
  );

  return {
    isLoading,
    hasFilledOutProfile: Boolean(
      profile?.first_name && profile?.last_name && profile?.headline,
    ),
  };
}
