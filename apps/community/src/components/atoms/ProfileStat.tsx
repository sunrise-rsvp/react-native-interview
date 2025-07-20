import {
  Button,
  ButtonVariants,
  TextBold,
  TextLight,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import {
  getFormattedLabel,
  getFormattedValue,
  type LabelFormattingOption,
  type ValueFormattingOption,
} from '@utils/formatting';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  value: number | undefined;
  label: 'connection' | 'follower' | 'following';
  valueFormatting?: ValueFormattingOption;
  labelFormatting?: LabelFormattingOption;
  onPress?: () => void;
};

export default function ProfileStat({
  value,
  label,
  valueFormatting = 'none',
  labelFormatting = 'pluralise',
  onPress,
}: Props) {
  const [height, setHeight] = useState(0);
  const styles = useDynamicStyles(createStyles, { height });

  const valueToDisplay = getFormattedValue(value, valueFormatting);
  const labelToDisplay = getFormattedLabel(label, value, labelFormatting);

  return (
    <View>
      <Button
        variant={ButtonVariants.CLEAR}
        size="large"
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        onPress={onPress}
        disabled={value === undefined}
      >
        <TextReg style={styles.hiddenText}>{labelToDisplay}</TextReg>
      </Button>
      <View
        style={styles.profileStat}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeight(height);
        }}
      >
        <TextBold style={styles.statCount}>{valueToDisplay}</TextBold>
        <TextLight style={styles.statLabel}>{labelToDisplay}</TextLight>
      </View>
    </View>
  );
}

function createStyles({
  isMobile,
  isTablet,
  isDesktop,
  height,
}: WithResponsive<Props & { height: number }>) {
  return StyleSheet.create({
    profileStat: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      width: '100%',
      pointerEvents: 'none',
    },
    statCount: {
      fontSize: isDesktop ? 24 : 16,
    },
    statLabel: {
      fontSize: isMobile ? 12 : isTablet ? 14 : 16,
    },
    button: {
      minWidth: isMobile ? 95 : isTablet ? 110 : 120,
      backgroundColor: 'transparent', // For disabled state
    },
    buttonContent: {
      height,
    },
    buttonLabel: {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    hiddenText: {
      color: 'transparent',
      fontSize: isMobile ? 12 : isTablet ? 14 : 16,
    },
  });
}
