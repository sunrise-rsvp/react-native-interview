import type { Href, UnknownInputParams } from 'expo-router';
import { router } from 'expo-router';
import { useSearchParams } from './useSearchParams';

export function useNavigateWithRedirectUrl(initialRedirectUrl?: string) {
  const { redirectUrl } = useSearchParams<{ redirectUrl?: string }>();

  const navigate = (path: string, params: UnknownInputParams = {}) => {
    router.navigate({
      pathname: path,
      params: {
        redirectUrl: initialRedirectUrl
          ? encodeURIComponent(initialRedirectUrl)
          : redirectUrl,
        ...params,
      },
    } as Href);
  };

  return {
    navigate,
    redirectUrl: redirectUrl
      ? (decodeURIComponent(redirectUrl || '') as Href & string)
      : undefined,
    redirectParams: {
      redirectUrl,
    },
  };
}
