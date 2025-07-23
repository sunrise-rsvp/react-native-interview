import {
  QueryKeys,
  ticketsApi,
} from '@sunrise-ui/api-client';
import { type TemporalRelation } from '@sunrise-ui/api/events';
import { useUserAuth } from '@sunrise-ui/primitives';
import { useQuery } from '@tanstack/react-query';

const { ticketsKey, temporalKey } = QueryKeys.tickets;

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

