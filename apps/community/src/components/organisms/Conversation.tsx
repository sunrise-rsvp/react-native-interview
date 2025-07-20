import { useMessagesGroupedByTime } from '@hooks/useMessagesGroupedByTime';
import MessageGroup from '@molecules/MessageGroup';
import { useGetMessages } from '@queries/conversations';
import {
  Loader,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

type Props = {
  id: string;
};

export default function Conversation({ id }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useGetMessages(id);
  const styles = useDynamicStyles(createStyles);
  const listData = data?.pages.flatMap(
    (page) => page?.results.toReversed() ?? [],
  );

  if (!listData) return <Loader />;

  const messageGroups = useMessagesGroupedByTime(listData);

  return (
    <FlatList
      data={messageGroups}
      renderItem={({ item }) => <MessageGroup messages={item} />}
      keyExtractor={(item) => item[0]._id!}
      onEndReached={async () => {
        if (hasNextPage && !isFetching) {
          await fetchNextPage();
        }
      }}
      ListFooterComponent={isFetchingNextPage ? <Loader /> : null}
      contentContainerStyle={styles.conversationContainer}
      inverted
    />
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    conversationContainer: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      justifyContent: 'flex-end',
      gap: 20,
      paddingRight: isMobile ? 12 : 6,
    },
  });
