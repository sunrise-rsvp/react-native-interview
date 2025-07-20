import {
  QueryKeys,
  bulkGetProfiles,
  getMessages,
} from '@sunrise-ui/api-client';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

const { eventMessagesKey, eventMessagesPageSize } =
  QueryKeys.eventConversations;

export const useGetEventMessages = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    async queryFn({ pageParam }) {
      const eventConversationData = await getMessages(
        conversationId,
        pageParam,
        eventMessagesPageSize,
      );

      const userIdSet = new Set<string>();
      eventConversationData.results?.forEach((message) => {
        userIdSet.add(message.user_id);
      });
      const userIds = Array.from(userIdSet);

      await bulkGetProfiles(queryClient, userIds);

      return eventConversationData;
    },
    queryKey: [eventMessagesKey, conversationId, eventMessagesPageSize],
    initialPageParam: 0,
    getNextPageParam(lastPage): number | undefined {
      if (lastPage?.next) return lastPage.offset + lastPage.limit;
    },
    getPreviousPageParam(lastPage): number | undefined {
      if (lastPage?.previous) return lastPage.offset - lastPage.limit;
    },
    staleTime: Infinity,
  });
};
