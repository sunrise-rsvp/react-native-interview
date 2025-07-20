import {
  assertParameterIsNotUndefinedOrNull,
  QueryKeys,
  ticketsApi,
} from '@sunrise-ui/api-client';
import { type TemporalRelation } from '@sunrise-ui/api/events';
import { useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import { useMutation, useQuery } from '@tanstack/react-query';

const { ticketsKey, temporalKey, typeKey } = QueryKeys.tickets;

export const useGetTicketTypes = (eventId?: string) =>
  useQuery({
    async queryFn() {
      assertParameterIsNotUndefinedOrNull(eventId, 'eventId');

      const response = await ticketsApi.getTicketTypesTicketsTypeEventIdGet({
        eventId,
      });
      return response.data;
    },
    queryKey: [ticketsKey, typeKey, eventId],
    enabled: Boolean(eventId),
    staleTime: 300000,
  });

export const useGetUserTicketsTemporal = ({
  relation,
  enabled = true,
  userId,
}: {
  relation: TemporalRelation;
  userId?: string;
  enabled?: boolean;
}) => {
  const { currentUserId } = useUserAuth();
  const idToUse = userId || currentUserId;

  return useQuery({
    async queryFn() {
      const response =
        await ticketsApi.getUserTicketsTemporalTicketsTemporalTemporalRelationUsersUserIdGet(
          {
            userId: idToUse,
            temporalRelation: relation,
          },
        );
      return response.data;
    },
    queryKey: [ticketsKey, temporalKey, relation, idToUse],
    enabled: Boolean(enabled),
  });
};

export const useCreateTicketToken = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn(eventId: string) {
      const response =
        await ticketsApi.createEventTicketTokenTicketsEventsEventIdTokenPost({
          eventId,
        });
      return response.data;
    },
    async onError() {
      showSnackbar({
        text: 'Failed to join event. Please try again.',
        type: 'error',
      });
    },
  });
};
