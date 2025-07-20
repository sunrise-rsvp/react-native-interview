import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import { useGetRoomByEventId } from '@queries/rooms';
import { useGetUserTicketsTemporal } from '@queries/tickets';
import { TemporalRelation } from '@sunrise-ui/api/events/api';
import { useUserAuth } from '@sunrise-ui/primitives';
import { getRoomTimeStatus } from '@utils/timing';

export default function useVirtualEventInformation(
  eventId: string | undefined,
) {
  const { ticketToken, currentEventId } = useCurrentEventInfo();
  const { currentUserId } = useUserAuth();

  const { data: room, isLoading: isLoadingRoom } = useGetRoomByEventId(eventId);
  const { data: currentUserTickets, isLoading: isLoadingTickets } =
    useGetUserTicketsTemporal({ relation: TemporalRelation.Future });

  const hasTicket = currentUserTickets?.some(
    (ticket) => ticket.event_id === eventId,
  );
  const isHost = room?.user_id === currentUserId;
  const currentEventIsCardEvent = currentEventId === eventId;
  const waitingForHost =
    !isHost &&
    Boolean(ticketToken) &&
    currentEventIsCardEvent &&
    !room?.is_live;
  const { isPast, isPresent, isFuture } = getRoomTimeStatus(room);

  return {
    hasTicket,
    waitingForHost,
    isLoadingEventInformation: isLoadingTickets || isLoadingRoom,
    isPast,
    isPresent,
    isFuture,
  };
}
