import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: ReactNode;
};

export default function InboxView({ children }: Props) {
  const styles = useDynamicStyles(createStyles);

  return <View style={styles.container}>{children}</View>;
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: isMobile ? 0 : isTablet ? 16 : 20,
      paddingHorizontal: isMobile ? 0 : isTablet ? 16 : 20,
      paddingBottom: isMobile ? 12 : isTablet ? 16 : 20,
    },
  });
