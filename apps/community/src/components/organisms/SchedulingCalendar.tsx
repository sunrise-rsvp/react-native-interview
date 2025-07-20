import { PlusSignIcon } from '@hugeicons/core-free-icons';
import Calendar from '@molecules/Calendar';
import TimeScheduler from '@molecules/TimeScheduler';
import { Button, IconButton } from '@sunrise-ui/primitives';
import {
  checkForOverlaps,
  findAvailableSlot,
  sortSchedule,
} from '@utils/scheduling';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export type TimeSlot = {
  startDate: DateTime;
  endDate: DateTime;
};

export type CalendarSchedule = Map<string, TimeSlot[] | undefined>;

type CalendarType = {
  schedule: CalendarSchedule;
  errors: Map<string, boolean | undefined>;
};

export default function SchedulingCalendar() {
  const currentDateTime = DateTime.now().startOf('day');
  const [selectedDate, setSelectedDate] = useState<DateTime>(
    currentDateTime.plus({ day: 1 }),
  );
  const [calendar, setCalendar] = useState<CalendarType>({
    schedule: new Map(),
    errors: new Map(),
  });

  const daysInFutureToShow = 7;
  const { schedule: calendarSchedule, errors: calendarErrors } = calendar;
  const selectedDateString = selectedDate.toISO() ?? '';
  const daySchedule = calendarSchedule.get(selectedDateString) ?? [];
  const availableSlot = findAvailableSlot(daySchedule, selectedDate);

  // This is simple effect to run after state update and the day changes
  useEffect(() => {
    calendarSchedule.delete(currentDateTime.toISO());
    setCalendar({ schedule: calendarSchedule, errors: calendarErrors });
    // If we currently selected what is now today then move to next day
    if (selectedDate.hasSame(currentDateTime, 'day'))
      setSelectedDate(currentDateTime.plus({ day: 1 }));
  }, [currentDateTime.weekday]);

  const handleSelectDate = (date: DateTime) => {
    if (daySchedule.length > 1) {
      // Sort schedule for the previous day when switching
      const { neededSort } = sortSchedule(daySchedule);
      // Only perform state update if we actually needed to sort
      if (neededSort) {
        calendarSchedule.set(selectedDateString, daySchedule);
        setCalendar({ schedule: calendarSchedule, errors: calendarErrors });
      }
    }

    // Update if we select a different day or time has moved on sufficiently
    if (!selectedDate.hasSame(date, 'day') || selectedDate <= DateTime.now())
      setSelectedDate(date);
  };

  const updateDaySchedule = (index: number) => (timeSchedule?: TimeSlot) => {
    if (timeSchedule) daySchedule[index] = timeSchedule;
    else daySchedule.splice(index, 1);

    calendarSchedule.set(selectedDateString, daySchedule);
    calendarErrors.set(selectedDateString, checkForOverlaps(daySchedule));

    setCalendar({ schedule: calendarSchedule, errors: calendarErrors });
  };

  const addNewTimeSchedule = () => {
    updateDaySchedule(daySchedule.length)(availableSlot);
  };

  const copyTimeSchedule =
    (timeSchedule: TimeSlot) => (daysToCopy: boolean[]) => {
      for (let i = 1; i <= daysInFutureToShow; i++) {
        const date = currentDateTime.plus({ day: i });
        // Only copy if date is not the selected date and the array signifies we should copy
        if (
          !date.hasSame(selectedDate, 'day') &&
          daysToCopy[date.weekday - 1]
        ) {
          const dateString = date.toISO();
          const dateDaySchedule = calendarSchedule.get(dateString) ?? [];

          dateDaySchedule.push({
            startDate: timeSchedule.startDate.set({ day: date.day }),
            endDate: timeSchedule.endDate.set({
              day: date.day,
              hour: timeSchedule.endDate.hour || 24,
            }),
          });

          calendarErrors.set(
            dateString,
            checkForOverlaps(dateDaySchedule, true),
          );
          calendarSchedule.set(dateString, dateDaySchedule);
        }
      }

      setCalendar({ schedule: calendarSchedule, errors: calendarErrors });
    };

  return (
    <>
      <Calendar
        handleSelectDate={handleSelectDate}
        selectedDate={selectedDate}
        calendarSchedule={calendarSchedule}
        daysInFutureToShow={daysInFutureToShow}
      />
      <ScrollView
        contentContainerStyle={styles.schedulingSection}
        style={styles.scrollContainer}
      >
        {daySchedule.map((timeSchedule, index) => (
          <TimeScheduler
            key={`${timeSchedule.startDate.toISO()}-${timeSchedule.endDate.toISO()}-${index}`}
            startDate={timeSchedule.startDate}
            endDate={timeSchedule.endDate}
            updateDaySchedule={updateDaySchedule(index)}
            copyTimeSchedule={copyTimeSchedule(timeSchedule)}
          />
        ))}
        <IconButton
          icon={PlusSignIcon}
          onPress={addNewTimeSchedule}
          style={styles.addButton}
          size="medium"
          disabled={!availableSlot}
        />
      </ScrollView>
      <Button
        onPress={() => {
          console.log('save');
        }}
        style={styles.saveButton}
      >
        Save
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  calendarSection: {
    display: 'flex',
    gap: 8,
  },
  schedulingSection: {
    display: 'flex',
    gap: 12,
  },
  scrollContainer: {
    width: '100%',
    marginLeft: -12,
    marginRight: -12,
  },
  addButton: {
    alignSelf: 'center',
  },
  saveButton: {
    marginTop: -20,
  },
});
