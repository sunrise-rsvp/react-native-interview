import { refreshToken } from '@sunrise-ui/api-client';
import { useUserAuth } from '@sunrise-ui/primitives';
import { useEffect } from 'react';

export function useAuthenticateVisitor(onFailure?: () => void) {
  const {
    setHasAuthenticated,
    setCurrentUserId,
    setCurrentRefreshToken,
    isLoadingCredentials,
    currentRefreshToken,
    hasAuthenticated,
  } = useUserAuth();

  const refreshSession = async () => {
    const data = await refreshToken();
    setCurrentUserId(data.user_id);
    setCurrentRefreshToken(data.refresh_token);
    setHasAuthenticated(true);
  };

  useEffect(() => {
    if (!isLoadingCredentials && currentRefreshToken && !hasAuthenticated) {
      refreshSession().catch(onFailure);
    }
  }, [isLoadingCredentials]);
}
