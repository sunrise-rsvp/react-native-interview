import { useMemo } from 'react';
import type { WithResponsive } from '../utils/responsivity';
import { useMediaQueries } from '../utils/responsivity';

export function useDynamicStyles<T, P>(
  createFunc: (e: WithResponsive<T>) => P,
  deps: Partial<T> = {},
): P {
  const { isMobileWeb, isMobile, isTablet, isDesktop } = useMediaQueries();
  const args: WithResponsive<T> = {
    ...deps,
    isMobile,
    isMobileWeb,
    isTablet,
    isDesktop,
  };
  return useMemo(() => createFunc(args), Object.values(args));
}
