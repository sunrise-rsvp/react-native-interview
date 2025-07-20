import { useSafeContext } from '@sunrise-ui/primitives';
import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export type AppStateContextType = {
  appState: AppStateStatus;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const AppStateContext = createContext<AppStateContextType>();
AppStateContext.displayName = 'AppStateContext';

export const AppStateProvider = ({ children }: PropsWithChildren) => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });

    return subscription.remove;
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        appState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default function useAppState() {
  return useSafeContext(AppStateContext);
}
