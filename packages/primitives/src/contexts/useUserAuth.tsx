import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { useSafeContext } from './useSafeContext';

type UserAuthContextType = {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  hasAuthenticated: boolean;
  setHasAuthenticated: (value: boolean) => void;
  currentRefreshToken?: string;
  setCurrentRefreshToken: (token: string) => void;
  isLoadingCredentials: boolean;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const UserAuthContext = createContext<UserAuthContextType>();
UserAuthContext.displayName = 'UserAuthContext';

export const UserAuthProvider = ({ children }: PropsWithChildren) => {
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentRefreshToken, setCurrentRefreshToken] = useState('');
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);

  useEffect(() => {
    const loadCredentialsFromStore = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedAuthToken = await AsyncStorage.getItem('authToken');

      if (storedUserId) setCurrentUserId(storedUserId);

      if (storedRefreshToken) setCurrentRefreshToken(storedRefreshToken);

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
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  return useSafeContext(UserAuthContext);
}
