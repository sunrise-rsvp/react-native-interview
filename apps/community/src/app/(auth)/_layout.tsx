import { BlockedUsersProvider } from '@contexts/useBlockedUsers';
import useBackgroundManager from '@hooks/useBackgroundManager';
import { useHasFilledOutProfile } from '@hooks/useHasFilledOutProfile';
import useTicketCreatedListener from '@hooks/useTicketCreatedListener';
import useVersionRedirect from '@hooks/useVersionRedirect';
import HeaderButton from '@molecules/HeaderButton';
import { AuthGuard } from '@sunrise-ui/composites';
import { defaultBack } from '@utils/navigation';
import { headerOptionsCreator } from '@utils/screenOptions';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';

export default function AuthLayout() {
  useVersionRedirect();
  useBackgroundManager();
  return (
    <AuthGuard>
      <BlockedUsersProvider>
        <AuthStack />
      </BlockedUsersProvider>
    </AuthGuard>
  );
}

function AuthStack() {
  useTicketCreatedListener();
  const { hasFilledOutProfile, isLoading } = useHasFilledOutProfile();

  useEffect(() => {
    // Catch for sneaky users trying to access the app before filling out their profile
    if (!isLoading && !hasFilledOutProfile) {
      router.replace('/welcome');
    }
  }, [isLoading, hasFilledOutProfile]);

  return (
    <Stack screenOptions={headerOptionsCreator(<HeaderButton />)}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="enableNotifications"
        options={headerOptionsCreator(
          <HeaderButton
            onPress={() => {
              router.navigate('/events');
            }}
          />,
        )}
      />
      <Stack.Screen name="to/[userId]" />
      <Stack.Screen name="editProfile/index" />
      <Stack.Screen
        name="welcome/index"
        options={({ route }) => {
          const params = route.params as { eventId?: string } | undefined;
          if (!params?.eventId) return headerOptionsCreator();

          return headerOptionsCreator(
            <HeaderButton
              onPress={() => {
                // TODO: figure out why default back isn't working as expected
                // if (params.eventId) router.replace('/events');
                // else defaultBack('/events');
                router.navigate('/events');
              }}
            />,
          );
        }}
      />
    </Stack>
  );
}
