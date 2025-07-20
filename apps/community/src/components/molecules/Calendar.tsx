import CalendarDate, { DateStatus } from '@atoms/CalendarDate';
import { type CalendarSchedule } from '@organisms/SchedulingCalendar';
import { TextReg } from '@sunrise-ui/primitives';
import { DateTime } from 'luxon';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

type Props = {
  handleSelectDate: (date: DateTime) => void;
  selectedDate: DateTime;
  daysInFutureToShow: number;
  calendarSchedule: CalendarSchedule;
};
export default function Calendar({
  handleSelectDate,
  selectedDate,
  daysInFutureToShow,
  calendarSchedule,
}: Props) {
  const currentDateTime = DateTime.now().startOf('day');
  const currentWeekDay = (currentDateTime.weekday % 7) + 1; // Sunday is the first day
  const startOfWeek = currentDateTime
    .startOf('week')
    .minus({ day: 1 })
    .plus({ week: currentWeekDay === 1 ? 1 : 0 }); // *sigh*
  const dates: DateTime[] = [];
  for (let i = 0; i < daysInFutureToShow + currentWeekDay; i++) {
    dates.push(startOfWeek.plus({ day: i }));
  }

  const getDateStatus = (date: DateTime): DateStatus => {
    if (selectedDate?.hasSame(date, 'day')) return DateStatus.SELECTED;
    if (calendarSchedule.get(date.toISO() ?? '')?.length)
      return DateStatus.SCHEDULED;
    return DateStatus.DEFAULT;
  };

  return (
    <View style={styles.calendarSection}>
      <View style={styles.row}>
        {daysOfWeek.map((day) => (
          <TextReg key={day} style={styles.dayOfWeek}>
            {day}
          </TextReg>
        ))}
      </View>
      <View style={styles.row}>
        {dates.map((date) => (
          <CalendarDate
            key={date.day}
            date={date}
            onPress={handleSelectDate}
            status={getDateStatus(date)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarSection: {
    display: 'flex',
    gap: 8,
    width: 368,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayOfWeek: {
    width: 44,
    textAlign: 'center',
  },
});
