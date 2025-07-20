import { TicketTypes } from '@constants/TicketTypes';
import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import { useGetRoomByEventId, useJoinRoom } from '@queries/rooms';
import {
  useCreateTicketToken,
  useGetTicketTypes,
  useGetUserTicketsTemporal,
} from '@queries/tickets';
import { useCreateTicket } from '@sunrise-ui/api-client';
import { TemporalRelation } from '@sunrise-ui/api/events/api';
import { useUserAuth } from '@sunrise-ui/primitives';
import { router } from 'expo-router';

export default function useRsvpAndJoinEvent(
  eventId: string | undefined,
  cleanupBeforeNavigation?: () => void,
) {
  const { setTicketToken, setRoomToken, setCurrentEventId, setCurrentRoomId } =
    useCurrentEventInfo();
  const { currentUserId } = useUserAuth();

  const { data: ticketTypes, isLoading: isLoadingTicketTypes } =
    useGetTicketTypes(eventId);
  const { data: room, isLoading: isLoadingRoom } = useGetRoomByEventId(eventId);
  const { data: currentUserTickets, isLoading: isLoadingTickets } =
    useGetUserTicketsTemporal({ relation: TemporalRelation.Future });

  const { mutateAsync: createTicket, isPending: isCreatingTicket } =
    useCreateTicket();
  const { mutateAsync: createTicketToken, isPending: isCreatingTicketToken } =
    useCreateTicketToken();
  const { mutateAsync: joinRoom, isPending: isJoiningRoom } = useJoinRoom();

  const hasTicket = currentUserTickets?.some(
    (ticket) => ticket.event_id === eventId,
  );
  const isHost = currentUserId === room?.user_id;
  const isRSVPing = isCreatingTicket;
  const isLoadingRsvp = isLoadingTicketTypes;
  const isJoiningEvent =
    isCreatingTicketToken || isJoiningRoom || (!hasTicket && isRSVPing);
  const isLoadingJoin =
    isLoadingRoom || isLoadingTickets || (!hasTicket && isLoadingRsvp);

  const rsvpToEvent = async () => {
    if (!eventId) return;

    // TODO: is there any way to NOT call the ticket types for every event?
    const attendeeTicketType = ticketTypes?.find(
      (type) => type.name === TicketTypes.GENERAL_ADMISSION,
    );
    if (attendeeTicketType) {
      await createTicket({
        user_id: currentUserId,
        event_id: eventId,
        ticket_type_id: attendeeTicketType.id!,
      });
    }
  };

  const joinRoomAsAttendee = async (ticketToken: string) => {
    if (!eventId || !room) return;

    const { token } = await joinRoom({
      joinRoomInput: {
        room_id: room.id!,
        user_id: currentUserId,
      },
      ticketToken,
    });
    setRoomToken(token);
    cleanupBeforeNavigation?.();
    router.navigate(`/live/${eventId}`);
  };

  const joinEvent = async (redirection?: () => void) => {
    if (!eventId || !room) return;

    if (!hasTicket) {
      await rsvpToEvent();
    }

    const { token } = await createTicketToken(eventId);
    setTicketToken(token);
    setCurrentEventId(eventId);
    setCurrentRoomId(room.id!);

    if (isHost) {
      cleanupBeforeNavigation?.();
      router.navigate('/greenRoom');
    } else if (room.is_live) {
      // pass fresh ticket token along bc it may not be stored yet
      await joinRoomAsAttendee(token);
    } else {
      cleanupBeforeNavigation?.();
      redirection?.();
    }
  };

  return {
    joinEvent,
    isJoiningEvent,
    isLoadingJoin,
    rsvpToEvent,
    isLoadingRsvp,
    isRSVPing,
    joinRoomAsAttendee,
  };
}
