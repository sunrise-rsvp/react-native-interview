import React, { type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button as PaperButton,
  type ButtonProps as PaperButtonProps,
} from 'react-native-paper';
import { Colors } from '../constants/Colors';

export enum ButtonVariants {
  WHITE,
  PURPLE,
  DARK,
  DARK_50,
  CLEAR,
  PINK,
  ORANGE,
}

export type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  variant?: ButtonVariants;
  loading?: boolean;
} & PaperButtonProps;

export function Button({
  size = 'medium',
  variant = ButtonVariants.WHITE,
  children,
  style,
  contentStyle,
  labelStyle,
  ...otherProps
}: PropsWithChildren<ButtonProps>) {
  const getBackgroundColor = () => {
    switch (variant) {
      case ButtonVariants.WHITE:
        return Colors.opacity20;
      case ButtonVariants.PURPLE:
        return Colors.purple1;
      case ButtonVariants.PINK:
        return Colors.pink0;
      case ButtonVariants.ORANGE:
        return Colors.orange0;
      case ButtonVariants.DARK:
        return Colors.purple0;
      case ButtonVariants.DARK_50:
        return Colors.purple0opacity50;
      case ButtonVariants.CLEAR:
        return 'transparent';
      default:
        return Colors.opacity20;
    }
  };

  return (
    <PaperButton
      mode="contained"
      buttonColor={getBackgroundColor()}
      textColor={Colors.text}
      style={[styles[size], style]}
      contentStyle={[styles[`${size}Content`], contentStyle]}
      labelStyle={[styles[`${size}Label`], labelStyle]}
      {...otherProps}
    >
      {children}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  small: {
    borderRadius: 15,
  },
  medium: {
    borderRadius: 22,
  },
  large: {
    borderRadius: 28,
  },
  smallContent: {
    height: 30,
  },
  mediumContent: {
    height: 44,
  },
  largeContent: {
    height: 56,
  },
  smallLabel: {
    marginVertical: 5,
    fontSize: 12,
  },
  mediumLabel: {
    fontSize: 16,
  },
  largeLabel: {
    fontSize: 20,
  },
});
