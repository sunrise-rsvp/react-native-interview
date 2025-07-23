import { ThemeProvider } from '@react-navigation/native';
import {  registerQueryClient } from '@sunrise-ui/api-client';
import {
  PaperTheme,
  SnackbarProvider,
  SunriseTheme,
  UserAuthProvider,
  useSunriseFonts
} from '@sunrise-ui/primitives';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, Portal } from 'react-native-paper';

const queryClient = new QueryClient();

registerQueryClient(queryClient);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

SplashScreen.setOptions({
  duration: 750,
  fade: true
});

function RootLayout() {
  const [loaded, error] = useSunriseFonts();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <UserAuthProvider>
          <ThemeProvider value={SunriseTheme}>
            <PaperProvider theme={PaperTheme}>
              <SnackbarProvider>
                <Portal.Host>
                  <Slot />
                  {/* @ts-expect-error -- style prop incorrectly errors */}
                  <StatusBar style="light" />
                </Portal.Host>
              </SnackbarProvider>
            </PaperProvider>
          </ThemeProvider>
        </UserAuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
