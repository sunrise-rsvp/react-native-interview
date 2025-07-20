import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  ActivityIndicator,
  type ActivityIndicatorProps,
} from 'react-native-paper';
import { Colors } from '../constants/Colors';

type Props = {
  size?: ActivityIndicatorProps['size'];
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Loader({ size, color, style }: Props) {
  const styles = StyleSheet.create({
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
  });

  return (
    <View style={[styles.loading, style]}>
      <ActivityIndicator size={size} color={color ?? Colors.opacity50} />
    </View>
  );
}
