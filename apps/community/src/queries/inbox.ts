import {
  assertParameterIsNotEmptyString,
  inboxApi,
  QueryKeys,
} from '@sunrise-ui/api-client';
import { type ConnectionType } from '@sunrise-ui/api/messenger';
import { useUserAuth } from '@sunrise-ui/primitives';
import { useInfiniteQuery } from '@tanstack/react-query';

const { inboxKey } = QueryKeys.inbox;

type GetInboxInput = {
  connectionType: ConnectionType;
  enabled?: boolean;
};

export const useGetInbox = ({
  connectionType,
  enabled = true,
}: GetInboxInput) => {
  const { currentUserId } = useUserAuth();
  return useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      assertParameterIsNotEmptyString(currentUserId, 'currentUserId');

      const response = await inboxApi.getInboxInboxGet({
        userId: currentUserId,
        connectionType,
        offset: pageParam,
        limit: 20,
      });
      return response.data;
    },
    queryKey: [inboxKey, connectionType, currentUserId],
    initialPageParam: 0,
    getNextPageParam(lastPage): number | undefined {
      if (lastPage?.next) return lastPage.offset + lastPage.limit;
    },
    getPreviousPageParam(lastPage): number | undefined {
      if (lastPage?.previous) return lastPage.offset - lastPage.limit;
    },
    enabled: Boolean(currentUserId && enabled),
    staleTime: 30000,
  });
};
