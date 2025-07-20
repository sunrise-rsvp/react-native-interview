import EmojiBlastButton from '@atoms/EmojiBlastButton';
import Colors from '@constants/Colors';
import AuctionWidget from '@molecules/AuctionWidget';
import BringToStageButton from '@molecules/BringToStageButton';
import ExtensionWidget from '@molecules/ExtensionWidget';
import RaiseHandButton from '@molecules/RaiseHandButton';
import { useGetRoomByEventId } from '@queries/rooms';
import {
  NonMobile,
  useDynamicStyles,
  useSearchParams,
  useUserAuth,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function DesktopEventOverlay() {
  const { eventId } = useSearchParams<{ eventId: string }>();
  const { currentUserId } = useUserAuth();
  const { data: room, isLoading } = useGetRoomByEventId(eventId);
  const styles = useDynamicStyles(createStyles);

  if (isLoading || !room) return null;

  return (
    <NonMobile>
      <View style={styles.emojiContainer}>
        <View style={styles.emojiPill}>
          <EmojiBlastButton emoji="&#x1F389;" />
          <EmojiBlastButton emoji="&#x1F602;" />
          <EmojiBlastButton emoji="&#x1F525;" />
          <EmojiBlastButton emoji="&#x1FAE0;" />
        </View>
      </View>
      <ExtensionWidget style={styles.extensionWidget} />
      <View style={styles.bottomRightContainer}>
        <AuctionWidget />
        {currentUserId === room.user_id ? (
          <BringToStageButton />
        ) : (
          <RaiseHandButton />
        )}
      </View>
    </NonMobile>
  );
}

const createStyles = () =>
  StyleSheet.create({
    bottomRightContainer: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      display: 'flex',
      gap: 16,
    },
    extensionWidget: {
      position: 'absolute',
      right: 16,
      top: 16,
    },
    emojiContainer: {
      position: 'absolute',
      bottom: 16,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    emojiPill: {
      backgroundColor: Colors.dark.purple0opacity50,
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: 8,
      borderRadius: 44,
    },
  });
