import { type ReactNode } from 'react';
import { Platform } from 'react-native';
import { useMediaQuery } from 'react-responsive';

export const isWeb = Platform.OS === 'web';
export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';
export const isNative = (isAndroid || isIos) && !isWeb;

export const breakpoints = {
  small: 600,
  medium: 768,
  large: 992,
  xlarge: 1200,
};

type Responsive = {
  isMobileWeb: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export type WithResponsive<T = unknown> = Partial<T> & Responsive;

export const useMediaQueries = (): Responsive => {
  const isMobileWeb = useMediaQuery({ maxWidth: breakpoints.medium - 1 });
  const isMobile = isMobileWeb || isNative;
  const isTablet = useMediaQuery({
    minWidth: breakpoints.medium,
    maxWidth: breakpoints.large - 1,
  });
  const isDesktop = useMediaQuery({ minWidth: breakpoints.large });
  return { isMobileWeb, isMobile, isTablet, isDesktop };
};

type Props = {
  children: ReactNode;
};

export const Desktop = ({ children }: Props) => {
  const { isDesktop } = useMediaQueries();
  return isDesktop ? children : null;
};

export const NonDesktop = ({ children }: Props) => {
  const { isDesktop } = useMediaQueries();
  return isDesktop ? null : children;
};

export const Tablet = ({ children }: Props) => {
  const { isTablet } = useMediaQueries();
  return isTablet ? children : null;
};

export const NonMobile = ({ children }: Props) => {
  const { isMobile } = useMediaQueries();
  return isMobile ? null : children;
};

export const Mobile = ({ children }: Props) => {
  const { isMobile } = useMediaQueries();
  return isMobile ? children : null;
};

export const MobileWeb = ({ children }: Props) => {
  const isMobileWeb = useMediaQueries();
  return isMobileWeb ? children : null;
};

export const NonNative = ({ children }: Props) => (isNative ? null : children);

export const Development = ({ children }: Props) => (__DEV__ ? children : null);
