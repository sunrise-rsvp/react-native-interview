import Colors from '@constants/Colors';
import { Alert02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
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
export default function Alert({ text }: Props) {
  const styles = useDynamicStyles(createStyles);
  return (
    <View style={styles.container}>
      <HugeiconsIcon icon={Alert02Icon} color={Colors.dark.text} />
      <TextBold style={styles.text}>{text}</TextBold>
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    container: {
      borderRadius: 10,
      height: 36,
      backgroundColor: Colors.dark.orange0,
      paddingHorizontal: 12,
      gap: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontSize: isMobile ? 12 : 14,
    },
  });
