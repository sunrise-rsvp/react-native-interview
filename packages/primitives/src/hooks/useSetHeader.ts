import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback } from 'react';

export function useSetHeader(options: NativeStackNavigationOptions) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions(options);
    }, [navigation, options]),
  );
}
