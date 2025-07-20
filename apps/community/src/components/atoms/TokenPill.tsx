import AnimatedTicker from '@atoms/AnimatedTicker';
import LogoToken from '@atoms/LogoToken';
import Colors from '@constants/Colors';
import usePlaySound, { Sounds } from '@hooks/usePlaySound';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

type Props = {
  amount?: number;
  size?: 'small' | 'medium';
  disabled?: boolean;
  loading?: boolean;
};

export default function TokenPill({
  amount,
  size = 'small',
  disabled,
  loading,
}: Props) {
  const styles = useDynamicStyles(createStyles, {
    isSmall: size === 'small',
    disabled,
  });
  const previousValue = useRef(amount);
  const { playSound } = usePlaySound(Sounds.cashRegisterOpen);

  useEffect(() => {
    if (!loading && amount !== undefined) {
      if (previousValue.current !== undefined && amount > previousValue.current)
        void playSound();
      previousValue.current = amount;
    }
  }, [amount, loading]);

  return (
    <View style={styles.pill}>
      <LogoToken size={size === 'small' ? 28 : 40} />
      {loading || amount === undefined ? (
        <ActivityIndicator
          size={size === 'small' ? 14 : 'small'}
          color={Colors.dark.opacity50}
        />
      ) : (
        <AnimatedTicker value={amount} size={size} />
      )}
    </View>
  );
}

const createStyles = ({
  isSmall,
  disabled,
}: WithResponsive<Props & { isSmall: boolean }>) =>
  StyleSheet.create({
    pill: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: disabled
        ? Colors.dark.disabled.purple1opacity50
        : Colors.dark.purple1opacity50,
      borderRadius: 100,
      paddingRight: isSmall ? 12 : 16,
      gap: isSmall ? 8 : 12,
    },
    icon: {
      width: isSmall ? 28 : 40,
      height: isSmall ? 28 : 40,
      tintColor: disabled ? Colors.dark.disabled.iconTint : undefined,
    },
  });
