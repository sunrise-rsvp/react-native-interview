import type { Duration } from 'luxon';
import { DateTime } from 'luxon';

export function formatDurationFromPastTimestamp(timestamp: string): string {
  if (!timestamp) return '';

  const now = DateTime.now();
  const past = DateTime.fromISO(timestamp);
  const diff = now.diff(past);

  return formatLargestUnit(diff);
}

function formatLargestUnit(duration: Duration): string {
  const normalizedDuration: Duration = duration.shiftTo(
    'days',
    'hours',
    'minutes',
    'seconds',
  );

  if (normalizedDuration.days >= 1) {
    return `${Math.floor(normalizedDuration.days)}d`;
  }

  if (normalizedDuration.hours >= 1) {
    return `${Math.floor(normalizedDuration.hours)}h`;
  }

  if (normalizedDuration.minutes >= 1) {
    return `${Math.floor(normalizedDuration.minutes)}m`;
  }

  return `${Math.floor(normalizedDuration.seconds)}s`;
}

export function formatTime(timestamp: string): string {
  return DateTime.fromISO(timestamp).toFormat('HH:mm');
}

export function formatVariableDateString(timestamp: string): string {
  const now = DateTime.now();
  const target = DateTime.fromISO(timestamp);

  // Check if the date is today
  if (target.hasSame(now, 'day')) {
    return 'Today';
  }

  // Check if the date is yesterday
  if (target.plus({ days: 1 }).hasSame(now, 'day')) {
    return 'Yesterday';
  }

  // Check if the date is within the last week
  const oneWeekAgo = now.minus({ days: 7 });
  if (target > oneWeekAgo) {
    return target.toFormat('EEEE');
  }

  // Check if the date is more than a year ago
  const oneYearAgo = now.minus({ years: 1 });
  if (target < oneYearAgo) {
    return target.toFormat('MMM dd, yyyy');
  }

  // If more than a week ago but less than a year, return the short date format
  return target.toFormat('MMM dd');
}

export function formatSecondsAsClockTime(seconds: number): string {
  // Ensure the input is a non-negative integer
  const totalSeconds = Math.abs(seconds);

  // Calculate minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  // Pad the minutes and seconds with leading zeros if necessary
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

  // Format the time as MM:SS
  return `${paddedMinutes}:${paddedSeconds}`;
}

/** takes a date string and time string and formats ISO UTC for server
 * example inputs:
 * '06/25/2024' and '00:17'
 * outputs:
 * '2024-06-25T05:17:36.864Z' */
export function formatIsoUtcFromDateAndTime(
  date: string,
  time: string,
): string {
  // Combine the date and time strings into one string
  const dateTimeStr = `${date} ${time}`;
  const dateTime = DateTime.fromFormat(dateTimeStr, 'MM/dd/yyyy HH:mm');
  return dateTime.toUTC().toISO() ?? '';
}
