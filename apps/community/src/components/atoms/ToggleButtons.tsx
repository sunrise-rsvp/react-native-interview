import Colors from '@constants/Colors';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

type Props = {
  value: string;
  onChange: (value: string) => void;
  buttons: Array<{ value: string; label: string }>;
  style?: StyleProp<ViewStyle>;
};

export default function ToggleButtons({
  value,
  onChange,
  buttons,
  style,
}: Props) {
  const styles = useDynamicStyles(createStyles);
  return (
    <SegmentedButtons
      buttons={buttons.map((button) => ({
        ...button,
        labelStyle: styles.buttonLabel,
        style: styles.button,
      }))}
      value={value}
      onValueChange={onChange}
      style={[styles.containerStyle, style]}
      theme={{
        colors: {
          secondaryContainer: Colors.dark.opacity20,
          outline: Colors.dark.opacity05,
          onSurface: Colors.dark.text,
          onSecondaryContainer: Colors.dark.text,
        },
      }}
    />
  );
}

const createStyles = ({ isMobile }: WithResponsive<Props>) =>
  StyleSheet.create({
    buttonLabel: {
      fontFamily: 'Poppins',
      fontSize: isMobile ? 12 : 16,
    },
    containerStyle: {
      width: '100%',
    },
    button: {
      flexGrow: 1,
    },
  });
