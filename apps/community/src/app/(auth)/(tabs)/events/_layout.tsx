import { headerOptionsCreator } from '@utils/screenOptions';
import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack screenOptions={headerOptionsCreator()}>
      <Stack.Screen name="index" options={headerOptionsCreator()} />
    </Stack>
  );
}
