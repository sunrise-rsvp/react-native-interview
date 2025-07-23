import React, { type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import { useMediaQueries, type WithResponsive } from '../utils/responsivity';
import { HeaderTitle } from './HeaderTitle';

type Props = {
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  headerTitle?: ReactNode;
  style?: StyleProp<ViewStyle>;
  logo?: ImageSourcePropType;
};

export function Header({
  headerLeft,
  headerRight,
  headerTitle,
  style,
  logo,
}: Props) {
  const insets = useSafeAreaInsets();
  const { isMobile } = useMediaQueries();
  const headerHeight = isMobile ? 54 : 76;
  const headerPadding = isMobile ? 12 : 16;
  const totalHeight = headerHeight + insets.top;
  const styles = useDynamicStyles(createStyles, {
    headerHeight,
    totalHeight,
    headerPadding,
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerTitle}>
        {headerTitle || (logo && <HeaderTitle logo={logo} />)}
      </View>
      <View style={styles.headerLeft}>{headerLeft}</View>
      <View style={styles.headerRight}>{headerRight}</View>
    </View>
  );
}

const createStyles = ({
  headerHeight,
  totalHeight,
  headerPadding,
}: WithResponsive<{
  headerHeight: number;
  headerPadding: number;
  totalHeight: number;
}>) =>
  StyleSheet.create({
    headerLeft: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      marginLeft: headerPadding,
      marginBottom: headerPadding,
    },
    headerRight: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      marginBottom: headerPadding,
      marginRight: headerPadding,
    },
    headerTitle: {
      height: headerHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    container: {
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: Colors.purple0,
      height: totalHeight,
    },
  });
