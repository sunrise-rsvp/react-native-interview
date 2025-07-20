import React from 'react';
import type { TextStyle } from 'react-native';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import type { WithResponsive } from '../utils/responsivity';
import { TextLight } from './StyledText';

type Props = {
  header: string;
  subheader?: string;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<TextStyle>;
};

export function PageHeader({ header, subheader, style, headerStyle }: Props) {
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={[styles.container, style]}>
      <TextLight style={[styles.header, headerStyle]}>{header}</TextLight>
      {subheader && <TextLight style={styles.subheader}>{subheader}</TextLight>}
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isMobile ? 12 : isTablet ? 16 : 20,
      width: '100%',
    },
    header: {
      textAlign: 'center',
      fontSize: isMobile ? 24 : isTablet ? 36 : 48,
    },
    subheader: {
      textAlign: 'center',
      fontSize: isMobile ? 16 : isTablet ? 24 : 32,
    },
  });
