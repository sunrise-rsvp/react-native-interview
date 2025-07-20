import type {
  CreateTicketInput,
  CreateTicketTypeInput,
  Ticket,
  TicketTransferData,
  TicketType,
  TicketsApiCheckInUserTicketsEventsEventIdUsersUserIdCheckInPostRequest,
} from '@sunrise-ui/api/events/api';
import { useSnackbar } from '@sunrise-ui/primitives';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { QueryKeys } from '../constants/QueryKeys';
import { ticketsApi } from '../utils/api';
import {
  assertParameterIsNotEmptyString,
  assertParameterIsNotUndefinedOrNull,
} from '../utils/error';
import { updateUserCheckInStatus } from '../utils/tickets';

const { ticketsKey, byEventIdKey, countKey, temporalKey, typeKey } =
  QueryKeys.tickets;

// Function to get tickets directly from API
const getTicketsByEventId = async (eventId?: string): Promise<Ticket[]> => {
  assertParameterIsNotEmptyString(eventId, 'eventId');
  assertParameterIsNotUndefinedOrNull(eventId, 'eventId');

  return await ticketsApi
    .getTicketsByEventIdTicketsEventsEventIdGet({
      eventId,
    })
    .then((response) => response.data);
};

export const useGetTicketsByEventId = (eventId?: string) => {
  return useQuery({
    queryFn: () => {
      return getTicketsByEventId(eventId);
    },
    queryKey: [ticketsKey, byEventIdKey, eventId],
    enabled: Boolean(eventId),
  });
};

// Hook to fetch tickets from multiple events simultaneously
export function useGetMultiEventTickets(eventIds: string[] = []) {
  // Use useQueries to run multiple ticket queries in parallel, but with direct API calls
  const ticketsQueries = useQueries({
    queries: eventIds.map((eventId) => {
      return {
        // Use the same query key structure as the original hook
        queryKey: [ticketsKey, byEventIdKey, eventId],
        // Use the direct API function, not the hook
        queryFn: () => getTicketsByEventId(eventId),
        enabled: !!eventId,
      };
    }),
  });

  // Process the query results
  const isLoading = ticketsQueries.some((query) => query.isLoading);
  const isError = ticketsQueries.some((query) => query.isError);

  // Return early with empty defaults if loading or error
  if (isLoading || isError) {
    return {
      isLoading,
      isError,
      ticketsData: [],
      userEventTicketsMap: new Map<string, Ticket[]>(),
      fullCheckedInUserIds: new Set<string>(),
      allUserIds: [],
    };
  }

  // Create a map of user IDs to their tickets from all events
  const userEventTicketsMap = new Map<string, Ticket[]>();

  // Process tickets directly into the user map
  ticketsQueries.forEach((query) => {
    if (query.data) {
      query.data.forEach((ticket: Ticket) => {
        const userId = ticket.user_id;

        if (!userEventTicketsMap.has(userId)) {
          userEventTicketsMap.set(userId, []);
        }
        userEventTicketsMap.get(userId)?.push(ticket);
      });
    }
  });

  // Extract all tickets for convenience
  const ticketsData = Array.from(userEventTicketsMap.values()).flat();

  // Determine which users are checked into all their events
  const fullCheckedInUserIds = new Set<string>();
  userEventTicketsMap.forEach((tickets, userId) => {
    const allTicketsCheckedIn = tickets.every((ticket) => ticket.is_checked_in);
    if (allTicketsCheckedIn && tickets.length > 0) {
      fullCheckedInUserIds.add(userId);
    }
  });

  return {
    isLoading,
    isError,
    ticketsData,
    userEventTicketsMap,
    fullCheckedInUserIds,
    allUserIds: Array.from(userEventTicketsMap.keys()),
  };
}

export type CheckInMutationArgs =
  TicketsApiCheckInUserTicketsEventsEventIdUsersUserIdCheckInPostRequest;

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn({ userId, token, eventId }: CheckInMutationArgs) {
      assertParameterIsNotUndefinedOrNull(eventId, 'eventId');
      const response =
        await ticketsApi.checkInUserTicketsEventsEventIdUsersUserIdCheckInPost({
          userId,
          eventId,
          token,
        });
      return response.data;
    },
    onMutate: async ({ userId, eventId }: CheckInMutationArgs) => {
      const ticketsQueryKey = [ticketsKey, byEventIdKey, eventId];
      return updateUserCheckInStatus({
        userId,
        checkInStatus: true,
        ticketsQueryKey,
        queryClient,
      });
    },
    async onError(_error, { eventId }, context) {
      const ticketsQueryKey = [ticketsKey, byEventIdKey, eventId];
      queryClient.setQueryData(ticketsQueryKey, context?.previousTickets);
      showSnackbar({
        text: 'Failed to check in user',
        type: 'error',
      });
    },
  });
};

export const useUndoCheckIn = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn({ userId, eventId }: { userId: string; eventId: string }) {
      assertParameterIsNotUndefinedOrNull(eventId, 'eventId');
      const response =
        await ticketsApi.undoCheckInUserTicketsEventsEventIdUsersUserIdCheckInUndoPost(
          {
            userId: userId,
            eventId,
          },
        );
      return response.data;
    },
    onMutate: async ({
      userId,
      eventId,
    }: {
      userId: string;
      eventId: string;
    }) => {
      const ticketsQueryKey = [ticketsKey, byEventIdKey, eventId];
      return updateUserCheckInStatus({
        userId,
        checkInStatus: false,
        ticketsQueryKey,
        queryClient,
      });
    },
    async onError(_error, { eventId }, context) {
      const ticketsQueryKey = [ticketsKey, byEventIdKey, eventId];
      queryClient.setQueryData(ticketsQueryKey, context?.previousTickets);
      showSnackbar({
        text: 'Failed to remove check in for user',
        type: 'error',
      });
    },
  });
};

export const useCreateTicketType = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<TicketType, unknown, CreateTicketTypeInput>({
    async mutationFn(createTicketTypeInput: CreateTicketTypeInput) {
      const response = await ticketsApi.createTicketTypeTicketsTypePost({
        createTicketTypeInput,
      });
      return response.data;
    },
    async onSuccess({ event_id }) {
      await queryClient.invalidateQueries({
        queryKey: [ticketsKey, typeKey, event_id],
      });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to create ticket type. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useCreateTicket = ({
  onTicketCreated,
}: {
  onTicketCreated?: (ticketId: string) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<Ticket, unknown, CreateTicketInput>({
    async mutationFn(createTicketInput: CreateTicketInput) {
      const response = await ticketsApi.createTicketTicketsPost({
        createTicketInput,
      });
      return response.data;
    },
    async onSuccess(ticket, createTicketInput) {
      if (ticket.id && onTicketCreated) {
        onTicketCreated(ticket.id);
      }

      const { event_id } = createTicketInput;
      await queryClient.invalidateQueries({
        queryKey: [ticketsKey, temporalKey],
      });
      await queryClient.invalidateQueries({
        queryKey: [ticketsKey, byEventIdKey, event_id],
      });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to RSVP. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useTransferTicket = (ticket: Ticket) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  return useMutation({
    async mutationFn(receiver: TicketTransferData) {
      const response = await ticketsApi.transferTicketTicketsTransferPost({
        transferTicketInput: {
          event_id: ticket.event_id,
          user_id: ticket.user_id,
          ticket_id: ticket.id!,
          organization_id: ticket.organization_id!,
          receiver_ticket: receiver,
        },
      });
      return response.data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [ticketsKey, byEventIdKey, ticket.event_id],
      });
    },
    async onError() {
      showSnackbar({
        text: 'Transfer of ticket failed',
        type: 'error',
      });
    },
  });
};

export const useGetTicketCountForEvents = (eventIds?: string[]) => {
  return useQuery({
    queryFn: async () => {
      assertParameterIsNotUndefinedOrNull(eventIds, 'eventIds');
      const response =
        await ticketsApi.countTicketsByEventsTicketsEventsCountPost({
          requestBody: eventIds,
        });
      return response.data;
    },
    queryKey: [ticketsKey, countKey, eventIds],
    enabled: Boolean(eventIds && eventIds.length > 0),
  });
};
