import {
  Button,
  ButtonVariants,
  TextReg,
  isNative,
  useDynamicStyles,
} from '@sunrise-ui/primitives';
import { DateTime } from 'luxon';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  date: DateTime;
  status: DateStatus;
  onPress?: (date: DateTime) => void;
};

export enum DateStatus {
  DEFAULT,
  SELECTED,
  SCHEDULED,
}

export default function CalendarDate({ date, status, onPress }: Props) {
  const now = DateTime.now().startOf('day');
  const isPast = date < now;
  const isToday = date.hasSame(now, 'day');
  const styles = useDynamicStyles(createStyles);

  const getButtonVariant = () => {
    switch (status) {
      case DateStatus.SELECTED:
        return ButtonVariants.PURPLE;
      case DateStatus.SCHEDULED:
        return ButtonVariants.PINK;
      default:
        return ButtonVariants.WHITE;
    }
  };

  if (isPast) return <View style={styles.container} />;

  if (isToday)
    return (
      <View style={styles.container}>
        <TextReg>{date.day}</TextReg>
        <View style={styles.todayDot} />
      </View>
    );

  return (
    <Button
      style={styles.container}
      labelStyle={[styles.buttonContent, styles.container]}
      onPress={() => {
        onPress?.(date);
      }}
      variant={getButtonVariant()}
    >
      <TextReg>{date.day}</TextReg>
    </Button>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      width: 44,
      height: 44,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 22,
    },
    todayDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: '#fff',
      position: 'absolute',
      bottom: 2,
    },
    buttonContent: {
      marginLeft: 0,
      marginRight: 0,
      marginTop: isNative ? 24 : 0,
      marginBottom: 0,
    },
  });
