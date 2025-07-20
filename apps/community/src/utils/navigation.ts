import { router, type Href } from 'expo-router';

export const routerGoBackOrReplace = (replacePath: Href) => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(replacePath);
  }
};

export const defaultBack =
  (path: Href = '/'): (() => void) =>
  () => {
    routerGoBackOrReplace(path);
  };
