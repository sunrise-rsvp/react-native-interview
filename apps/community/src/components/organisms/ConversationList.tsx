import Colors from '@constants/Colors';
import EmptyState from '@molecules/EmptyState';
import InboxItem from '@molecules/InboxItem';
import { useGetInbox } from '@queries/inbox';
import {
  type ConnectionType,
  type ConversationSchema,
} from '@sunrise-ui/api/messenger';
import {
  Loader,
  useDynamicStyles,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import useBlockedUsers from '../../contexts/useBlockedUsers';

type Props = {
  connectionType: ConnectionType;
  openConversation: (conversationId: string, userId: string) => void;
  activeConversationId?: string;
};

export default function ConversationList({
  connectionType,
  openConversation,
  activeConversationId,
}: Props) {
  const { isUserBlocked, isLoading: isLoadingBlockedUsers } = useBlockedUsers();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    isLoading: isLoadingInbox,
    data: inboxData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch: refetchInbox,
  } = useGetInbox({
    connectionType,
    enabled: !isLoadingBlockedUsers,
  });
  const { currentUserId } = useUserAuth();

  const listData = useMemo(
    () =>
      inboxData?.pages.flatMap(
        (page) =>
          page?.results?.filter((page) => {
            const otherUserId = page.conversation.users.find(
              (id) => id !== currentUserId,
            );
            return otherUserId ? !isUserBlocked(otherUserId) : false;
          }) ?? [],
      ),
    [inboxData, isUserBlocked, currentUserId],
  );

  const styles = useDynamicStyles(createStyles);

  const handlePress = (conversation: ConversationSchema) => () => {
    if (conversation._id) {
      const otherUserId =
        conversation.users.find((id) => id !== currentUserId) ?? '';
      openConversation(conversation._id, otherUserId);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchInbox();
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        renderItem={({ item: { conversation, last_message, unread } }) => (
          <InboxItem
            key={`conversation-list-item-${conversation._id}`}
            userId={conversation.users.find((id) => id !== currentUserId) ?? ''}
            subtext={last_message?.content ?? ''}
            unreadCount={unread.unread_count}
            timestamp={last_message?.timestamp ?? ''}
            onPress={handlePress(conversation)}
            isActive={activeConversationId === conversation._id}
          />
        )}
        keyExtractor={(item) => item.conversation._id!}
        onEndReached={async () => {
          if (hasNextPage && !isFetchingNextPage) {
            await fetchNextPage();
          }
        }}
        ListFooterComponent={
          isFetchingNextPage ? <Loader size="small" /> : null
        }
        ListEmptyComponent={
          isLoadingInbox ? (
            <Loader size="large" style={{ paddingTop: 20 }} />
          ) : (
            <EmptyState
              header="No conversations yet."
              subheader="Start one now!"
            />
          )
        }
      />
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      height: '100%',
      paddingLeft: isMobile ? 12 : isTablet ? 16 : 20,
      paddingRight: isMobile ? 0 : isTablet ? 8 : 10,
      paddingVertical: isMobile ? 0 : isTablet ? 6 : 10,
      borderRadius: 30,
      backgroundColor: isMobile ? 'transparent' : Colors.dark.opacity05,
    },
  });
