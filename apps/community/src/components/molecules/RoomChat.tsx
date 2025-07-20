import { RoomChatItem } from '@atoms/RoomChatItem';
import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import { useGetEventMessages } from '@queries/eventConversations';
import {
  Loader,
  isAndroid,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

type Props = {
  isPreview?: boolean;
  hidden?: boolean;
  numberMessagesToDisplay?: number;
};

export default function RoomChat({
  isPreview,
  hidden,
  numberMessagesToDisplay = 4,
}: Props) {
  const { currentRoomId } = useCurrentEventInfo();
  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetEventMessages(currentRoomId);
  const listData = data?.pages.flatMap(
    (page) => page?.results.toReversed() ?? [],
  );

  const styles = useDynamicStyles(createStyles, {
    hidden,
    numberMessagesToDisplay,
  });

  if (!listData) return hidden ? null : <Loader />;

  const visibleMessages = listData.slice(0, numberMessagesToDisplay);

  if (isPreview)
    return (
      <View style={styles.previewContainer}>
        {visibleMessages.toReversed().map((message) => (
          <RoomChatItem
            message={message}
            key={message._id}
            style={styles.chatItem}
            animateFadeOut
          />
        ))}
      </View>
    );

  return (
    <FlatList
      data={listData}
      renderItem={({ item }) => (
        <RoomChatItem
          key={item._id}
          message={item}
          style={[styles.inverted, styles.chatItem]}
        />
      )}
      keyExtractor={(item) => item._id!}
      onEndReached={async () => {
        if (hasNextPage && !isFetching) {
          await fetchNextPage();
        }
      }}
      ListFooterComponent={isFetchingNextPage ? <Loader /> : null}
      contentContainerStyle={styles.fullContainer}
      style={styles.inverted}
    />
  );
}

const createStyles = ({
  hidden,
  isMobile,
  numberMessagesToDisplay,
  isTablet,
}: WithResponsive<Props>) =>
  StyleSheet.create({
    previewContainer: {
      display: hidden ? 'none' : 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      maxHeight: (numberMessagesToDisplay ?? 1) * 1.2 * (isMobile ? 16 : 18), // 4 lines
      overflow: 'hidden',
    },
    chatItem: {
      fontSize: isMobile ? 16 : isTablet ? 16 : 18,
      lineHeight: 1.2 * (isMobile ? 16 : isTablet ? 16 : 18),
    },
    fullContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      gap: 8,
    },
    inverted: isAndroid
      ? { transform: [{ scale: -1 }] }
      : { transform: [{ scaleY: -1 }] },
  });
