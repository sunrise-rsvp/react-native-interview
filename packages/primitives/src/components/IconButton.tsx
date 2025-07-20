import type { HugeiconsProps, IconSvgElement } from '@hugeicons/react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  IconButton as PaperIconButton,
  type IconButtonProps,
} from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import type { WithResponsive } from '../utils/responsivity';

type Props = {
  icon: IconSvgElement;
  hugeIconProps?: Partial<HugeiconsProps>;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
} & Omit<IconButtonProps, 'size' | 'icon'>;

export const IconButton = ({
  icon: Icon,
  size = 'small',
  iconColor,
  backgroundColor,
  style,
  hugeIconProps,
  ...otherProps
}: Props) => {
  const styles = useDynamicStyles(createStyles, { backgroundColor });
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 24 : 30;

  return (
    <PaperIconButton
      style={[styles[size], styles.iconButton, style]}
      icon={() => (
        <HugeiconsIcon
          icon={Icon}
          color={iconColor ?? Colors.text}
          size={iconSize}
          {...hugeIconProps}
        />
      )}
      iconColor={iconColor ?? Colors.text}
      size={iconSize}
      {...otherProps}
    />
  );
};

const createStyles = ({ backgroundColor }: WithResponsive<Props>) =>
  StyleSheet.create({
    small: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    medium: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    large: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    iconButton: {
      margin: 0,
      backgroundColor: backgroundColor ?? Colors.opacity20,
    },
  });
