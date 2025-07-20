import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { UserRole, parseAuthToken } from '../utils/auth';
import { useSafeContext } from './useSafeContext';

type UserAuthContextType = {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  hasAuthenticated: boolean;
  setHasAuthenticated: (value: boolean) => void;
  currentRefreshToken?: string;
  setCurrentRefreshToken: (token: string) => void;
  isLoadingCredentials: boolean;
  currentUserRole: UserRole;
  hasAcceptedTerms: boolean;
  setAuthTokenInfo: (authToken: string) => void;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const UserAuthContext = createContext<UserAuthContextType>();
UserAuthContext.displayName = 'UserAuthContext';

export const UserAuthProvider = ({ children }: PropsWithChildren) => {
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentRefreshToken, setCurrentRefreshToken] = useState('');
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(
    UserRole.BASIC,
  );
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const setAuthTokenInfo = (authToken: string) => {
    const { role, hasAcceptedTerms } = parseAuthToken(authToken);
    setCurrentUserRole(role);
    setHasAcceptedTerms(hasAcceptedTerms);
  };

  useEffect(() => {
    const loadCredentialsFromStore = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedAuthToken = await AsyncStorage.getItem('authToken');

      if (storedUserId) setCurrentUserId(storedUserId);

      if (storedRefreshToken) setCurrentRefreshToken(storedRefreshToken);

      if (storedAuthToken) setAuthTokenInfo(storedAuthToken);

      if (!storedAuthToken || !storedRefreshToken || !storedUserId)
        setHasAuthenticated(false);
    };

    void loadCredentialsFromStore().then(() => {
      setIsLoadingCredentials(false);
    });
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        currentUserId,
        setCurrentUserId,
        currentRefreshToken,
        hasAuthenticated,
        setCurrentRefreshToken,
        setHasAuthenticated,
        isLoadingCredentials,
        currentUserRole,
        hasAcceptedTerms,
        setAuthTokenInfo,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  return useSafeContext(UserAuthContext);
}
