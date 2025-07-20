import {
  TextBold,
  TextLight,
  TextReg,
  isNative,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { DateTime } from 'luxon';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  startDate: DateTime;
};

export default function EventDateDisplay({ startDate }: Props) {
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.eventStartDateTime}>
      <View style={styles.calendar}>
        <View style={styles.monthLine}>
          <TextLight style={styles.month}>
            {startDate.setLocale('en').monthShort}
          </TextLight>
        </View>
        <View style={styles.dayLine}>
          <TextBold style={styles.day}>{startDate.day}</TextBold>
        </View>
      </View>
      <View style={styles.weekdayAndTime}>
        <TextReg>{startDate.setLocale('en').weekdayShort}</TextReg>
        <TextReg>{startDate.toLocaleString(DateTime.TIME_SIMPLE)}</TextReg>
      </View>
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    eventStartDateTime: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    calendar: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 10,
      width: isMobile ? 64 : 78,
      height: isMobile ? 64 : 78,
    },
    monthLine: {
      borderBottomColor: '#fff',
      borderBottomWidth: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    month: {
      // To center vertically on native mobile
      marginBottom: isNative ? 2 : 0,
      fontSize: isMobile ? 12 : 16,
    },
    dayLine: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    day: {
      fontSize: isMobile ? 24 : 32,
    },
    weekdayAndTime: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      alignItems: isMobile ? 'flex-start' : 'center',
      fontSize: isMobile ? 14 : 16,
    },
  });
