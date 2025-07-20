import Colors from '@constants/Colors';
import type { IconSvgElement } from '@hugeicons/react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  icon: IconSvgElement;
  text: string;
};

export default function IconListItem({ icon: Icon, text }: Props) {
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.listItem}>
      <HugeiconsIcon icon={Icon} color={Colors.dark.text} />
      <TextReg style={styles.text}>{text}</TextReg>
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    listItem: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    text: {
      fontSize: isMobile ? 16 : 20,
      flexShrink: 1,
    },
  });
