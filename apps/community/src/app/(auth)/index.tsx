import { Redirect } from 'expo-router';
import React from 'react';

export default function RootPage() {
  return <Redirect href="/profile" />
}