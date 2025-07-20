import useBlockedUsers from '@contexts/useBlockedUsers';
import {
  QueryKeys,
  assertParameterIsNotEmptyString,
  conversationsApi,
  getMessages,
} from '@sunrise-ui/api-client';
import {
  ConversationType,
  type ConnectionType,
  type Conversation,
  type ConversationsApiGetConversationByUserIdsConversationsUsersGetRequest,
  type ConversationsApiGetConversationConversationsConversationIdUsersUserIdGetRequest,
  type ConversationsApiGetConversationUnreadConversationsConversationIdUnreadsGetRequest,
  type ConversationsApiSendMessageConversationsConversationIdMessagesPostRequest,
  type CreateConversationInput,
  type CreateMessageInput,
  type Message,
} from '@sunrise-ui/api/messenger';
import { useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';

const {
  conversationsKey,
  messagesKey,
  unreadKey,
  unreadCountKey,
  messagesPageSize,
} = QueryKeys.conversations;
const { inboxKey } = QueryKeys.inbox;

export const useGetMessages = (conversationId: string) =>
  useInfiniteQuery({
    queryFn: async ({ pageParam }) =>
      getMessages(conversationId, pageParam, messagesPageSize),
    queryKey: [messagesKey, conversationId, messagesPageSize],
    initialPageParam: 0,
    getNextPageParam(lastPage): number | undefined {
      if (lastPage?.next) return lastPage.offset + lastPage.limit;
    },
    getPreviousPageParam(lastPage): number | undefined {
      if (lastPage?.previous) return lastPage.offset - lastPage.limit;
    },
    staleTime: Infinity,
  });

type SendMessageArgs = Omit<
  ConversationsApiSendMessageConversationsConversationIdMessagesPostRequest,
  'createMessageInput'
> &
  CreateMessageInput;

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<Message, unknown, SendMessageArgs>({
    async mutationFn({ conversationId, user_id, content }) {
      const response =
        await conversationsApi.sendMessageConversationsConversationIdMessagesPost(
          {
            conversationId,
            createMessageInput: {
              user_id,
              content,
            },
          },
        );
      return response.data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [inboxKey] });
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // id comes as _id from BE even though the Conversation type doesn't specify it
  return useMutation<
    Conversation & { _id?: string },
    unknown,
    CreateConversationInput
  >({
    async mutationFn(createConversationInput: CreateConversationInput) {
      const response =
        await conversationsApi.createConversationConversationsPost({
          createConversationInput,
        });
      return response.data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [conversationsKey] });
      await queryClient.invalidateQueries({ queryKey: [inboxKey] });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to start conversation. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useGetConversationUnread = ({
  conversationId,
}: ConversationsApiGetConversationUnreadConversationsConversationIdUnreadsGetRequest) =>
  useQuery({
    async queryFn() {
      const response =
        await conversationsApi.getConversationUnreadConversationsConversationIdUnreadsGet(
          { conversationId },
        );
      return response.data;
    },
    queryKey: [conversationsKey, conversationId, unreadKey],
  });

export const useGetTotalUnreadCount = (connectionType: ConnectionType) => {
  const { currentUserId } = useUserAuth();
  return useQuery({
    async queryFn() {
      const response =
        await conversationsApi.getTotalUnreadCountConversationsUsersUserIdUnreadsCountGet(
          {
            userId: currentUserId,
            connectionType,
          },
        );
      return response.data.count;
    },
    queryKey: [conversationsKey, currentUserId, unreadCountKey, connectionType],
  });
};

export const useMarkConversationRead = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn() {
      await conversationsApi.markConversationReadConversationsConversationIdMessagesReadPut(
        { conversationId },
      );
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [inboxKey] });
      await queryClient.invalidateQueries({
        queryKey: [conversationsKey, conversationId, unreadKey],
      });
    },
  });
};

export const useGetConversationById = ({
  conversationId,
}: Pick<
  ConversationsApiGetConversationConversationsConversationIdUsersUserIdGetRequest,
  'conversationId'
>) => {
  const { isUserBlocked, isLoading: isLoadingBlockedUsers } = useBlockedUsers();
  const { currentUserId } = useUserAuth();

  const {
    data,
    isLoading: isLoadingConversation,
    ...otherProps
  } = useQuery<Conversation & { _id?: string }>({
    async queryFn() {
      assertParameterIsNotEmptyString(currentUserId, 'currentUserId');
      const response =
        await conversationsApi.getConversationConversationsConversationIdUsersUserIdGet(
          { conversationId, userId: currentUserId },
        );
      return response.data;
    },
    queryKey: [conversationsKey, conversationId],
    enabled: Boolean(conversationId),
  });

  const filteredData = useMemo(() => {
    const otherUserId = data?.users?.find((id) => id !== currentUserId);
    if (otherUserId && isUserBlocked(otherUserId)) return undefined;

    return data;
  }, [data, isUserBlocked]);

  return {
    isLoading: isLoadingConversation || isLoadingBlockedUsers,
    data: filteredData,
    ...otherProps,
  };
};

export const useGetConversationByUserIds = ({
  userIds,
  enabled,
}: ConversationsApiGetConversationByUserIdsConversationsUsersGetRequest & {
  enabled: boolean;
}) =>
  useQuery<Conversation & { _id?: string }>({
    async queryFn() {
      const response =
        await conversationsApi.getConversationByUserIdsConversationsUsersGet({
          userIds,
        });
      return response.data;
    },
    queryKey: [conversationsKey, userIds],
    enabled: userIds.length === 2 && enabled,
    retry: false,
  });

export default function useStartOrGetConversation() {
  const { currentUserId } = useUserAuth();
  const { showSnackbar } = useSnackbar();

  return useMutation<
    Conversation & { _id?: string },
    unknown,
    { userId: string }
  >({
    async mutationFn({ userId }) {
      const response = await conversationsApi
        .getConversationByUserIdsConversationsUsersGet({
          userIds: [userId, currentUserId],
        })
        .catch((error) => {
          if (error.response?.status === 404)
            return conversationsApi.createConversationConversationsPost({
              createConversationInput: {
                user_id: currentUserId,
                users: [userId, currentUserId],
                conversation_type: ConversationType.DirectMessage,
              },
            });

          throw error;
        });
      return response.data;
    },
    async onError() {
      showSnackbar({
        text: 'Failed to go to conversation. Please try again.',
        type: 'error',
      });
    },
  });
}

export const useReportMessage = () => {
  const queryClient = useQueryClient();
  const { currentUserId } = useUserAuth();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn(messageId: string) {
      assertParameterIsNotEmptyString(currentUserId, 'currentUserId');
      const response =
        await conversationsApi.reportMessageConversationsMessagesMessageIdReportPost(
          { reportMessageInput: { user_id: currentUserId }, messageId },
        );
      return response.data;
    },
    async onSuccess({ conversation_id }) {
      await queryClient.invalidateQueries({ queryKey: [inboxKey] });
      await queryClient.invalidateQueries({
        queryKey: [messagesKey, conversation_id, messagesPageSize],
      });
      showSnackbar({
        text: 'Reported and removed message from view',
        type: 'success',
      });
    },
  });
};
