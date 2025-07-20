import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useDynamicStyles } from '../hooks/useDynamicStyles';

type Props = {
  logo: ImageSourcePropType;
};

export function HeaderTitle({ logo }: Props) {
  const styles = useDynamicStyles(createStyles);
  return (
    <View style={styles.headerTitle}>
      <Image
        source={logo}
        style={styles.logo}
        accessibilityLabel="communiful logo"
        resizeMode="contain"
      />
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    headerTitle: {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
    },
    logo: {
      width: 168,
      height: 27,
    },
  });
