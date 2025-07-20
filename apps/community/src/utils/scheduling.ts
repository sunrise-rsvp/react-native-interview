import { type TimeSlot } from '@organisms/SchedulingCalendar';
import { type DateTime } from 'luxon';

/**
 * Finds an available slot in the given day schedule
 * - If there are no times already scheduled it returns a 9am - 5pm slot
 * - If there are available slots it returns the first available hour slot (starting from 12am)
 * @param daySchedule
 * @param selectedDate
 */
export function findAvailableSlot(
  daySchedule: TimeSlot[],
  selectedDate?: DateTime,
): TimeSlot | undefined {
  if (!selectedDate) return;

  if (!daySchedule.length)
    return {
      startDate: selectedDate.set({ hour: 9 }),
      endDate: selectedDate.set({ hour: 17 }),
    };

  const newDaySchedule = [...daySchedule];
  newDaySchedule.sort((a, b) => a.startDate.hour - b.startDate.hour);

  let nextAvailableStartHour = 0;
  let nextAvailableStartDate = selectedDate; // Throwaway initialiser

  newDaySchedule.forEach((value) => {
    if (value.startDate.hour <= nextAvailableStartHour) {
      // If end hour is 0 it's equivalent to 24
      const endHour = value.endDate.hour || 24;
      // Allow for overlapping intervals here
      if (endHour > nextAvailableStartHour) {
        nextAvailableStartHour = endHour;
        nextAvailableStartDate = value.endDate;
      }
    }
  });

  if (nextAvailableStartHour < 24)
    return {
      startDate: nextAvailableStartDate,
      endDate: nextAvailableStartDate.plus({ hour: 1 }),
    };
}

/**
 * Sorts a day schedule in place
 * Returns a boolean for whether the array needed sorting or not
 * @param daySchedule
 */
export function sortSchedule(daySchedule: TimeSlot[]): { neededSort: boolean } {
  let neededSort = false;
  daySchedule.sort((a, b) => {
    const difference = a.startDate.hour - b.startDate.hour;
    if (difference < 0) neededSort = true;
    return difference;
  });
  return { neededSort };
}

/**
 * Checks whether the day schedule has any overlapping time slots
 * Optionally sort the day schedule too
 * @param daySchedule
 * @param sort
 */
export function checkForOverlaps(
  daySchedule: TimeSlot[],
  sort?: boolean,
): boolean {
  let newDaySchedule;
  if (sort) {
    newDaySchedule = daySchedule;
  } else {
    newDaySchedule = [...daySchedule];
  }

  sortSchedule(newDaySchedule);

  let overlap = false;
  let nextAvailableStartHour = 0;

  newDaySchedule.forEach((timeSlot) => {
    if (timeSlot.startDate.hour >= nextAvailableStartHour) {
      nextAvailableStartHour = timeSlot.endDate.hour || 24;
    } else {
      overlap = true;
    }
  });

  return overlap;
}
