import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import {
  QueryKeys,
  assertParameterIsNotEmptyString,
  assertParameterIsNotUndefinedOrNull,
  roomsApi,
} from '@sunrise-ui/api-client';
import {
  TemporalRelation,
  type CreateVideoRoomInput,
  type JoinRoomInput,
} from '@sunrise-ui/api/events';
import { useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

const {
  roomsKey,
  sunriseExperienceKey,
  bulkRoomsKey,
  attendeesKey,
  byEventId,
} = QueryKeys.rooms;
const { extensionsKey } = QueryKeys.extensions;
const { auctionsKey } = QueryKeys.auctions;
const { eventMessagesKey } = QueryKeys.eventConversations;

export const useGetSunriseRooms = () => {
  const queryClient = useQueryClient();
  return useQuery({
    async queryFn() {
      const data = await roomsApi
        .getPublicRoomsTemporalRoomsPublicTemporalGet({
          temporalRelation: TemporalRelation.Future,
          experienceTypes: ['SUNRISE'],
        })
        .then((response) => response.data);

      data.forEach((room) => {
        queryClient.setQueryData([roomsKey, room.id], room);
        queryClient.setQueryData([roomsKey, byEventId, room.event_id], room);
      });

      return data;
    },
    queryKey: [roomsKey, sunriseExperienceKey],
    staleTime: 300000,
  });
};

export const useCreateVideoRoom = () => {
  const { ticketToken } = useCurrentEventInfo();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn(createVideoRoomInput: CreateVideoRoomInput) {
      const response = await roomsApi.createVideoRoomRoomsVideoRoomPost(
        {
          createVideoRoomInput,
        },
        {
          headers: { 'Ticket-Authorization': `Bearer ${ticketToken}` },
        },
      );
      return response.data;
    },
    async onError() {
      showSnackbar({
        text: 'Failed to enter room. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useGetRoom = (roomId?: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    async queryFn() {
      assertParameterIsNotUndefinedOrNull(roomId, 'roomId');

      const room = await roomsApi
        .getRoomRoomsRoomIdGet({ roomId })
        .then((response) => response.data);

      queryClient.setQueryData([roomsKey, byEventId, room.event_id], room);

      return room;
    },
    queryKey: [roomsKey, roomId],
    enabled: Boolean(roomId),
  });
};

/**
 * For now, we only care about the first room
 */
export const useGetRoomByEventId = (eventId?: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    async queryFn() {
      assertParameterIsNotUndefinedOrNull(eventId, 'eventId');

      const room = await roomsApi
        .listRoomsByEventIdRoomsEventsEventIdGet({ eventId })
        .then((response) => response.data[0]);

      queryClient.setQueryData([roomsKey, room.id], room);

      return room;
    },
    queryKey: [roomsKey, byEventId, eventId],
    enabled: Boolean(eventId),
  });
};

export const useGetBulkRooms = (eventIds?: string[]) => {
  const queryClient = useQueryClient();
  return useQuery({
    async queryFn() {
      assertParameterIsNotUndefinedOrNull(eventIds, 'eventIds');

      const data = await roomsApi
        .bulkGetRoomByEventIdsRoomsBulkGet({
          eventIds,
        })
        .then((response) => response.data);

      data.forEach((room) => {
        queryClient.setQueryData([roomsKey, room.id], room);
        queryClient.setQueryData([roomsKey, byEventId, room.event_id], room);
      });

      return data;
    },
    queryKey: [bulkRoomsKey, byEventId, eventIds],
    enabled: Boolean(eventIds?.length),
  });
};

export const useGetRoomAttendees = ({
  roomId,
  enabled,
}: {
  roomId: string;
  enabled: boolean;
}) => {
  const { ticketToken } = useCurrentEventInfo();

  return useQuery({
    queryFn: async () =>
      roomsApi
        .listRoomAttendeesRoomsRoomIdAttendeesGet(
          {
            roomId,
          },
          {
            headers: { 'Ticket-Authorization': `Bearer ${ticketToken}` },
          },
        )
        .then((response) => response.data),
    queryKey: [roomsKey, attendeesKey, roomId],
    enabled: Boolean(roomId) && Boolean(ticketToken) && enabled,
  });
};

export const useJoinRoom = () => {
  const queryClient = useQueryClient();
  const { ticketToken: storedTicketToken, currentEventId } =
    useCurrentEventInfo();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn({
      joinRoomInput,
      ticketToken,
    }: {
      joinRoomInput: JoinRoomInput;
      ticketToken?: string;
    }) {
      const response = await roomsApi.joinVideoRoomRoomsJoinPost(
        {
          joinRoomInput,
        },
        {
          headers: {
            'Ticket-Authorization': `Bearer ${
              ticketToken || storedTicketToken
            }`,
          },
        },
      );
      return response.data;
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({
        queryKey: [roomsKey, variables.joinRoomInput.room_id],
      });
      await queryClient.invalidateQueries({
        queryKey: [roomsKey, byEventId, currentEventId],
      });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to join room. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useRaiseHand = () => {
  const { ticketToken, currentRoomId } = useCurrentEventInfo();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn() {
      assertParameterIsNotEmptyString(currentRoomId, 'currentRoomId');

      return roomsApi.raiseHandRoomsRoomIdRaiseHandPost(
        {
          roomId: currentRoomId,
        },
        {
          headers: { 'Ticket-Authorization': `Bearer ${ticketToken}` },
        },
      );
    },
    async onError() {
      showSnackbar({
        text: 'Failed to raise hand. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useLowerHand = () => {
  const { ticketToken, currentRoomId } = useCurrentEventInfo();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn() {
      assertParameterIsNotEmptyString(currentRoomId, 'currentRoomId');

      return roomsApi.lowerHandRoomsRoomIdLowerHandPost(
        {
          roomId: currentRoomId,
        },
        {
          headers: { 'Ticket-Authorization': `Bearer ${ticketToken}` },
        },
      );
    },
    async onError() {
      showSnackbar({
        text: 'Failed to lower hand. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useBringToStage = () => {
  const { ticketToken, currentRoomId } = useCurrentEventInfo();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn() {
      await roomsApi.acceptNextRaisedHandRoomsRoomIdAcceptRaisedHandNextPost(
        {
          roomId: currentRoomId,
        },
        {
          headers: { 'Ticket-Authorization': `Bearer ${ticketToken}` },
        },
      );
    },
    async onError() {
      showSnackbar({
        text: 'Failed to bring to stage. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useLeaveRoom = () => {
  const queryClient = useQueryClient();
  const { currentUserId } = useUserAuth();
  const { ticketToken, currentEventId, ticketId, currentRoomId, resetInfo } =
    useCurrentEventInfo();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn() {
      if (ticketId && currentRoomId && ticketToken) {
        return roomsApi.leaveRoomRoomsLeavePost(
          {
            leaveRoomInput: {
              room_id: currentRoomId,
              user_id: currentUserId,
              ticket_id: ticketId,
            },
          },
          {
            headers: {
              'Ticket-Authorization': `Bearer ${ticketToken}`,
            },
          },
        );
      }

      console.warn(
        `Skipped leave room. Missing
         ticketId: ${ticketId ? 'false' : 'true'},
         currentRoomId: ${currentRoomId ? 'false' : 'true'},
         ticketToken: ${ticketToken ? 'false' : 'true'}`,
      );
      return Promise.resolve();
    },
    async onSuccess() {
      router.navigate('/events');
      resetInfo();
      await queryClient.invalidateQueries({ queryKey: [extensionsKey] });
      await queryClient.invalidateQueries({ queryKey: [eventMessagesKey] });
      await queryClient.invalidateQueries({ queryKey: [auctionsKey] });
      await queryClient.invalidateQueries({
        queryKey: [roomsKey, byEventId, currentEventId],
      });
      await queryClient.invalidateQueries({
        queryKey: [roomsKey, currentRoomId],
      });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to leave room. Please try again.',
        type: 'error',
      });
    },
  });
};
