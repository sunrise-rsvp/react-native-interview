import { Cancel01Icon } from '@hugeicons/core-free-icons';
import CopyTimesModal from '@molecules/CopyTimesModal';
import { type TimeSlot } from '@organisms/SchedulingCalendar';
import { Dropdown, IconButton } from '@sunrise-ui/primitives';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const sharedTimeOptions = [
  { label: '1:00AM', value: 1 },
  { label: '2:00AM', value: 2 },
  { label: '3:00AM', value: 3 },
  { label: '4:00AM', value: 4 },
  { label: '5:00AM', value: 5 },
  { label: '6:00AM', value: 6 },
  { label: '7:00AM', value: 7 },
  { label: '8:00AM', value: 8 },
  { label: '9:00AM', value: 9 },
  { label: '10:00AM', value: 10 },
  { label: '11:00AM', value: 11 },
  { label: '12:00PM', value: 12 },
  { label: '1:00PM', value: 13 },
  { label: '2:00PM', value: 14 },
  { label: '3:00PM', value: 15 },
  { label: '4:00PM', value: 16 },
  { label: '5:00PM', value: 17 },
  { label: '6:00PM', value: 18 },
  { label: '7:00PM', value: 19 },
  { label: '8:00PM', value: 20 },
  { label: '9:00PM', value: 21 },
  { label: '10:00PM', value: 22 },
  { label: '11:00PM', value: 23 },
];

const startTimeOptions = [{ label: '12:00AM', value: 0 }, ...sharedTimeOptions];
const endTimeOptions = [...sharedTimeOptions, { label: '12:00AM', value: 24 }];

type Props = TimeSlot & {
  updateDaySchedule: (timeSchedule?: TimeSlot) => void;
  copyTimeSchedule: (daysToCopy: boolean[]) => void;
};

export default function TimeScheduler({
  startDate,
  endDate,
  updateDaySchedule,
  copyTimeSchedule,
}: Props) {
  const [startTime, setStartTime] = useState<number>(startDate.hour);
  // This is only used when mounting a new component
  let endHour = endDate.hour;
  if (!endDate.hasSame(startDate, 'day')) endHour = 24;

  const [endTime, setEndTime] = useState<number>(endHour);
  const endTimeOptionsFiltered = endTimeOptions.slice(startTime);

  const updateSchedule = (isEnd: boolean) => (value?: number) => {
    if (value === undefined) return;

    let newStartTime = startTime;
    let newEndTime = endTime;

    if (isEnd) {
      setEndTime(value);
      newEndTime = value;
      // Make sure start and end times are in order
      if (startTime >= endTime) newStartTime = newEndTime - 1;
    } else {
      setStartTime(value);
      newStartTime = value;
      // Make sure start and end times are in order
      if (endTime <= newStartTime) newEndTime = newStartTime + 1;
    }

    updateDaySchedule({
      startDate: startDate.set({ hour: newStartTime }),
      endDate: endDate.set({ hour: newEndTime }),
    });
  };

  return (
    <View style={styles.row}>
      <Dropdown
        placeholder="Start"
        options={startTimeOptions}
        onChange={updateSchedule(false)}
        value={startTime}
        notClearable={true}
        menuStyle={styles.dropdownButton}
      />
      <Dropdown
        placeholder="End"
        options={endTimeOptionsFiltered}
        onChange={updateSchedule(true)}
        value={endTime}
        notClearable={true}
        menuStyle={styles.dropdownButton}
      />
      <IconButton
        icon={Cancel01Icon}
        onPress={() => {
          updateDaySchedule();
        }}
      />
      <CopyTimesModal copyTimeSchedule={copyTimeSchedule} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButton: {
    width: 130,
  },
});
