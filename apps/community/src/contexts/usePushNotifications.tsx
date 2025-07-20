import * as Notifications from 'expo-notifications';
import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import useAppState from '@contexts/useAppState';
import { useSafeContext } from '@sunrise-ui/primitives';
import { CustomerIO } from '@utils/CustomerIO';
import { type PermissionResponse } from 'expo-modules-core/src/PermissionsInterface';

export type PushNotificationsContextType = {
  permission?: PermissionResponse;
  refetchPermission: () => Promise<PermissionResponse>;
  requestPermission: () => Promise<PermissionResponse>;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const PushNotificationsContext = createContext<PushNotificationsContextType>();
PushNotificationsContext.displayName = 'PushNotificationsContext';

export const PushNotificationsProvider = ({ children }: PropsWithChildren) => {
  const [permission, setPermission] = useState<PermissionResponse>();
  const { appState } = useAppState();

  const requestPermission = async () => {
    if (!permission || (!permission?.granted && permission?.canAskAgain)) {
      const response = await Notifications.requestPermissionsAsync();
      setPermission(response);

      if (response.granted) {
        if (CustomerIO) {
          const token =
            await CustomerIO.pushMessaging.getRegisteredDeviceToken();
          void CustomerIO.registerDeviceToken(token);
        }
      }

      return response;
    }

    return permission;
  };

  const refetchPermission = async () => {
    const response = await Notifications.getPermissionsAsync();
    setPermission(response);
    return response;
  };

  useEffect(() => {
    if (appState === 'active') void refetchPermission();
  }, [appState]);

  return (
    <PushNotificationsContext.Provider
      value={{
        permission,
        refetchPermission,
        requestPermission,
      }}
    >
      {children}
    </PushNotificationsContext.Provider>
  );
};

export default function usePushNotifications() {
  return useSafeContext(PushNotificationsContext);
}
