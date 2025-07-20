import { useLocalSearchParams } from 'expo-router';

export function useSearchParams<T>() {
  return useLocalSearchParams() as T;
}
