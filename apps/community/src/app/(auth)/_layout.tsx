import { AuthGuard } from '@sunrise-ui/composites';
import { Stack } from 'expo-router';
import React from 'react';
import { LogoFull } from '@assets/images';
import { Header } from '@sunrise-ui/primitives';

export default function AuthLayout() {
  return (
    <AuthGuard>
      <AuthStack />
    </AuthGuard>
  );
}

function AuthStack() {
  return (
    <Stack screenOptions={{ header: () => <Header logo={LogoFull} />}}>
      <Stack.Screen name="editProfile"/>
      <Stack.Screen name="profile" />
    </Stack>
  );
}
