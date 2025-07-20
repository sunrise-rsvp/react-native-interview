import {
  useGetEvent,
  useGetEventLocation,
  useGetTicketsByEventId,
} from '@sunrise-ui/api-client';
import { useUserAuth } from '@sunrise-ui/primitives';
import { DateTime } from 'luxon';

export default function useInPersonEventInformation(
  eventId: string,
  locationId?: string,
) {
  const { currentUserId } = useUserAuth();
  const { data: event, isLoading: isLoadingEvent } = useGetEvent(eventId);
  const { data: location, isLoading: isLoadingLocation } =
    useGetEventLocation(locationId);
  const { data: eventTickets, isLoading: isLoadingTickets } =
    useGetTicketsByEventId(eventId);

  const ticket = eventTickets?.find(
    (ticket) => ticket.user_id === currentUserId,
  );
  const now = DateTime.now();
  const startDate = DateTime.fromISO(event?.start_date ?? '');
  const isToday = startDate.hasSame(now, 'day');
  const isPast = startDate < now && !isToday;

  return {
    isLoading: isLoadingEvent || isLoadingTickets || isLoadingLocation,
    ticket,
    isToday,
    location,
    isPast,
  };
}
