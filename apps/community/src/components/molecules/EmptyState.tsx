import Colors from '@constants/Colors';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  TextLight,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  header: string;
  subheader: string;
};

export default function EmptyState({ header, subheader }: Props) {
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.emptyStateContainer}>
      <HugeiconsIcon
        icon={Mail01Icon}
        color={Colors.dark.text}
        size={100}
        strokeWidth={0.5}
      />
      <View style={styles.textContainer}>
        <TextLight style={styles.text}>{header}</TextLight>
        <TextLight style={styles.text}>{subheader}</TextLight>
      </View>
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    emptyStateContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      width: '100%',
      height: '100%',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
    },
  });
