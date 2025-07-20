import { Redirect } from 'expo-router';
import React from 'react';

export default function RootScreen() {
  return <Redirect href="/events" />;
}
