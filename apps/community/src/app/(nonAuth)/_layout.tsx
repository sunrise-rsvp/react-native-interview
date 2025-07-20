import useVersionRedirect from '@hooks/useVersionRedirect';
import { headerOptionsCreator } from '@utils/screenOptions';
import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  useVersionRedirect();
  return (
    <Stack screenOptions={headerOptionsCreator()}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
