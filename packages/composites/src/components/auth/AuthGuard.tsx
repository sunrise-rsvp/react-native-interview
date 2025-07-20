import { Colors, useUserAuth } from '@sunrise-ui/primitives';
import { Redirect, router } from 'expo-router';
import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuthenticateVisitor } from '../../hooks/useAuthenticateVisitor';
import { AcceptTermsView } from './AcceptTermsView';

export function AuthGuard({ children }: PropsWithChildren) {
  useAuthenticateVisitor(() => {
    router.navigate('/login');
  });
  const {
    currentRefreshToken,
    hasAuthenticated,
    hasAcceptedTerms,
    isLoadingCredentials,
  } = useUserAuth();

  if (isLoadingCredentials) return <View style={styles.loadingScreen} />;

  if (!currentRefreshToken) return <Redirect href="/login" />;

  if (!hasAuthenticated) return <View style={styles.loadingScreen} />;

  if (!hasAcceptedTerms) return <AcceptTermsView />;

  return children;
}

const styles = StyleSheet.create({
  loadingScreen: {
    backgroundColor: Colors.purple0,
    width: '100%',
    height: '100%',
  },
});
