import {
  TextBold,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  text: string;
};
export default function Stamp({ text }: Props) {
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.border}>
      <TextBold style={styles.text}>{text}</TextBold>
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    border: {
      borderRadius: 5,
      borderColor: '#fff',
      borderWidth: 1,
      padding: 6,
      transform: [{ rotate: '-15deg' }],
      marginVertical: 20,
    },
    text: {
      fontSize: isMobile ? 24 : 48,
    },
  });
