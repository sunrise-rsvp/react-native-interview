import {
  type LimitOffsetPaginatorMessage,
  type Message,
} from '@sunrise-ui/api/messenger';
import type {
  InfiniteData,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query';
import { conversationsApi } from './api';
import { assertParameterIsNotEmptyString } from './error';

export const getMessages = async (
  conversationId: string,
  pageParam: number,
  pageSize: number,
) => {
  assertParameterIsNotEmptyString(conversationId, 'conversationId');

  const response =
    await conversationsApi.getMessagesConversationsConversationIdMessagesGet({
      conversationId,
      offset: pageParam,
      limit: pageSize,
    });
  return response.data;
};

export const updateMessagesCache = (
  message: Message,
  queryKey: QueryKey,
  queryClient: QueryClient,
) => {
  const messagesQueryState = queryClient.getQueryState(queryKey);
  if (messagesQueryState?.fetchStatus === 'fetching') return;

  const queryMessagesUpdater = (
    oldData: InfiniteData<LimitOffsetPaginatorMessage> | undefined,
  ) => {
    if (!oldData) return;

    const { pageParams, pages } = oldData;
    const updatedPageParams = [...pageParams];
    const updatedCount = pages[0].count + 1;
    const pageSize = pages[0].limit;
    const lastPageIndex = pages.length - 1;
    let carryOverMessage = message;
    let lastPageOffset = pageSize;

    const updatedPages = pages.map((page, index) => {
      const isLastPage = index === pages.length - 1;
      const isFullPage = page.results.length === pageSize;

      if (isFullPage) {
        lastPageOffset = page.offset;
        const [oldestMessage, ...latestMessages] = page.results;
        latestMessages.push(carryOverMessage);
        carryOverMessage = oldestMessage;

        return {
          ...page,
          count: updatedCount,
          next: isLastPage
            ? `/messages/?offset=${lastPageOffset + pageSize}&limit=${pageSize}`
            : page.next,
          results: latestMessages,
        };
      }

      return {
        ...page,
        count: updatedCount,
        results: [...page.results, carryOverMessage],
      };
    });

    if (pages[lastPageIndex].results.length === pageSize) {
      updatedPages.push({
        count: updatedCount,
        limit: pageSize,
        previous: `/messages/?offset=${lastPageOffset}&limit=${pageSize}`,
        offset: lastPageOffset + pageSize,
        results: [carryOverMessage],
      });
      updatedPageParams.push(lastPageOffset + pageSize);
    }

    return {
      ...oldData,
      pageParams: updatedPageParams,
      pages: updatedPages,
    };
  };

  queryClient.setQueryData<InfiniteData<LimitOffsetPaginatorMessage>>(
    queryKey,
    queryMessagesUpdater,
  );
};
