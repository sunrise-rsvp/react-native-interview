import { Stack } from 'expo-router';
import React from 'react';
import { LogoFull } from '@assets/images';
import { Header } from '@sunrise-ui/primitives';

export default function Layout() {
  return (
    <Stack screenOptions={{ header: () => <Header logo={LogoFull} />}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
