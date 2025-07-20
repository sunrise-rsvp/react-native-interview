import EmojiBlastButton from '@atoms/EmojiBlastButton';
import NotificationBadge from '@atoms/NotificationBadge';
import Colors from '@constants/Colors';
import useRoomTab, { RoomTab } from '@contexts/useRoomTab';
import AuctionWidget from '@molecules/AuctionWidget';
import BringToStageButton from '@molecules/BringToStageButton';
import ExtensionWidget from '@molecules/ExtensionWidget';
import RaiseHandButton from '@molecules/RaiseHandButton';
import RoomChat from '@molecules/RoomChat';
import AttendeeSideBar from '@organisms/AttendeeSideBar';
import RoomConversation from '@organisms/RoomConversation';
import SettingsSideBar from '@organisms/SettingsSideBar';
import TokenSideBar from '@organisms/TokenSideBar';
import { useGetRoomByEventId } from '@queries/rooms';
import { useGetUserTokens } from '@queries/tokens';
import {
  IconButton,
  isAndroid,
  isIos,
  Mobile,
  Modal,
  useDynamicStyles,
  useSearchParams,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { getTabsIcon } from '@utils/icons';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

const mobileTabs = [
  RoomTab.TOKENS,
  RoomTab.SETTINGS,
  RoomTab.ATTENDEES,
  RoomTab.CHAT,
];

export function MobileEventOverlay() {
  const { width } = useWindowDimensions();
  const { eventId } = useSearchParams<{ eventId: string }>();
  const { currentUserId } = useUserAuth();
  const { data: room, isLoading } = useGetRoomByEventId(eventId);
  const { currentRoomTab, setCurrentRoomTab } = useRoomTab();
  const styles = useDynamicStyles(createStyles, { width });
  const { data: tokens } = useGetUserTokens();

  if (isLoading || !room) return null;

  return (
    <Mobile>
      <Modal
        visible={Boolean(currentRoomTab)}
        hide={() => {
          setCurrentRoomTab();
        }}
        fullscreenOnBreakpoint={false}
        breakpoint="tablet"
        modalStyle={styles.modal}
      >
        {currentRoomTab === RoomTab.CHAT && <RoomConversation />}
        {currentRoomTab === RoomTab.TOKENS && <TokenSideBar />}
        {currentRoomTab === RoomTab.SETTINGS && <SettingsSideBar />}
        {currentRoomTab === RoomTab.ATTENDEES && <AttendeeSideBar />}
      </Modal>
      <View style={styles.buttonContainer}>
        <View style={styles.purplePill}>
          <EmojiBlastButton emoji="&#x1F389;" />
          <EmojiBlastButton emoji="&#x1F602;" />
          <EmojiBlastButton emoji="&#x1F525;" />
          <EmojiBlastButton emoji="&#x1FAE0;" />
        </View>
        <View style={styles.purplePill}>
          {mobileTabs.map((tab) => (
            <NotificationBadge
              key={tab}
              text={
                tab === RoomTab.TOKENS
                  ? tokens?.count.toLocaleString(undefined, {
                      useGrouping: false,
                    })
                  : undefined
              }
            >
              <IconButton
                key={tab}
                icon={getTabsIcon(tab)}
                onPress={() => {
                  setCurrentRoomTab(tab);
                }}
                iconColor={
                  currentRoomTab === tab
                    ? Colors.dark.yellow0
                    : Colors.dark.text
                }
                size="medium"
                backgroundColor={
                  currentRoomTab === tab ? Colors.dark.purple0 : 'transparent'
                }
              />
            </NotificationBadge>
          ))}
          {currentUserId === room.user_id ? (
            <BringToStageButton />
          ) : (
            <RaiseHandButton />
          )}
        </View>
      </View>
      <View style={styles.eventChat}>
        <RoomChat isPreview={true} hidden={Boolean(currentRoomTab)} />
      </View>
      <ExtensionWidget style={styles.extensionWidget} />
      <View style={styles.auctionWidgetContainer}>
        <AuctionWidget />
      </View>
    </Mobile>
  );
}

const createStyles = ({ width }: WithResponsive<{ width: number }>) =>
  StyleSheet.create({
    purplePill: {
      backgroundColor: Colors.dark.purple0opacity50,
      borderRadius: 22,
    },
    buttonContainer: {
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      gap: 12,
      position: 'absolute',
      right: 12,
      bottom: 16,
    },
    modal: {
      backgroundColor: isIos
        ? Colors.dark.purple0
        : Colors.dark.purple0opacity85,
    },
    extensionWidget: {
      position: 'absolute',
      top: 10,
      right: 12,
    },
    auctionWidgetContainer: {
      position: 'absolute',
      left: 12,
      height: '100%',
      justifyContent: 'center',
      top: isAndroid ? 20 : 4,
    },
    eventChat: {
      position: 'absolute',
      bottom: 16,
      left: 12,
      maxWidth: (width ?? 0) - 80,
    },
  });
