import TokenPill from '@atoms/TokenPill';
import Colors from '@constants/Colors';
import {
  Button,
  isNative,
  useDynamicStyles,
  type ButtonProps,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = Pick<ButtonProps, 'loading' | 'onPress' | 'disabled'> & {
  value: number;
};

export default function TokenCircleButton({
  loading,
  onPress,
  disabled,
  value,
}: Props) {
  const styles = useDynamicStyles(createStyles, { loading, disabled });

  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        onPress={onPress}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        disabled={loading || disabled}
      >
        <TokenPill
          amount={value}
          size="small"
          disabled={disabled}
          loading={loading}
        />
      </Button>
    </View>
  );
}

const createStyles = ({ isMobile, loading, disabled }: WithResponsive<Props>) =>
  StyleSheet.create({
    // add the shadow styling to the container because it does not work on
    // Android when added directly to the button
    container: {
      borderRadius: 72,
      shadowColor: loading || !disabled ? Colors.dark.yellow0 : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: isNative ? 5 : 10,
      elevation: 10, // Needed for Android
    },
    button: {
      borderRadius: 72,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        loading || !disabled
          ? Colors.dark.purple0
          : Colors.dark.disabled.purple0,
    },
    buttonContent: {
      width: isMobile ? 120 : 144,
      height: isMobile ? 120 : 144,
    },
    buttonLabel: {
      marginTop: 0,
      marginLeft: 0,
      marginBottom: 0,
      marginRight: 0,
    },
  });
