import Colors from '@constants/Colors';
import {
  isNative,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type Props = {
  children: ReactNode;
  style?: ViewProps['style'];
  disabled?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
};

export default function Card({
  children,
  style,
  disabled,
  shadowColor,
  shadowOpacity,
}: Props) {
  const styles = useDynamicStyles(createStyles, {
    disabled,
    shadowColor,
    shadowOpacity,
  });

  return <View style={[styles.container, style]}>{children}</View>;
}

const createStyles = ({
  isMobile,
  isTablet,
  disabled,
  shadowColor,
  shadowOpacity,
}: WithResponsive<Props>) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isMobile ? 12 : isTablet ? 16 : 20,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      backgroundColor: Colors.dark.purple0,
      borderRadius: isMobile ? 16 : 30,
      opacity: disabled ? 0.4 : undefined,
      shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: shadowOpacity || 0.5,
      shadowRadius: isNative ? 5 : 10,
      elevation: 10, // Needed for Android
    },
  });
