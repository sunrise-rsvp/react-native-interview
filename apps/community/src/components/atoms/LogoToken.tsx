import { LogoIcon } from '@assets/images';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  size: number;
};

export default function LogoToken({ size }: Props) {
  const styles = useDynamicStyles(createStyles, { size });
  return (
    <View style={styles.token}>
      <Image
        source={LogoIcon}
        aria-label="communiful logo icon"
        style={styles.icon}
      />
    </View>
  );
}

const createStyles = ({ size }: WithResponsive<Props>) =>
  StyleSheet.create({
    token: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 100,
      width: size,
      height: size,
    },
    icon: {
      width: (size ?? 1) * 0.5,
      height: (size ?? 1) * 0.5,
    },
  });
