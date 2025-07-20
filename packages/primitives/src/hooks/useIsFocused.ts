import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useIsFocused() {
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, []),
  );

  return isFocused;
}
