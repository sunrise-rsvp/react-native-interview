import { type Room } from '@sunrise-ui/api/events';
import { DateTime } from 'luxon';

export function getRoomTimeLeft(room?: Room) {
  if (!room) return {};

  const now = DateTime.now();
  const endDate = DateTime.fromISO(room.scheduled_end_date ?? '');
  const timeLeft = endDate.diff(now, ['minutes', 'seconds']);
  const isFinished = now >= endDate;
  const secondsLeft = String(Math.floor(timeLeft.seconds)).padStart(2, '0');
  const minutesLeft = timeLeft.minutes.toString();
  const isAlmostFinished =
    parseInt(minutesLeft, 10) === 0 && parseInt(secondsLeft, 10) <= 10;

  return {
    isFinished,
    isAlmostFinished,
    minutesLeft,
    secondsLeft,
    millisecondsLeft: endDate.diff(now, 'milliseconds').milliseconds,
  };
}

export function getRoomTimeStatus(room?: Room) {
  if (!room) return {};

  const startDate = DateTime.fromISO(room.start_date);
  const endDate = room?.actual_end_date
    ? DateTime.fromISO(room.actual_end_date)
    : undefined;

  const now = DateTime.now();
  const isPast = Boolean(endDate);
  const isPresent = startDate <= now && !isPast;
  const isFuture = startDate > now;

  return {
    isPast,
    isPresent,
    isFuture,
  };
}
