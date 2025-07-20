import NotificationBadge from '@atoms/NotificationBadge';
import useRoomTab, { RoomTab } from '@contexts/useRoomTab';
import RoomSideBarButton from '@molecules/RoomSideBarButton';
import AttendeeSideBar from '@organisms/AttendeeSideBar';
import RoomConversation from '@organisms/RoomConversation';
import SettingsSideBar from '@organisms/SettingsSideBar';
import TokenSideBar from '@organisms/TokenSideBar';
import { useGetUserTokens } from '@queries/tokens';
import {
  NonMobile,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

export default function RoomSideBar() {
  const { currentRoomTab } = useRoomTab();
  const { isTablet } = useMediaQueries();
  const sideBarMaxWidth = isTablet ? 350 : 400;
  const styles = useDynamicStyles(createStyles, { sideBarMaxWidth });
  const width = useSharedValue(0);
  const { data: tokens } = useGetUserTokens();

  useEffect(() => {
    width.value = withTiming(currentRoomTab ? sideBarMaxWidth : 0, {
      duration: 400,
    });
  }, [currentRoomTab, sideBarMaxWidth]);

  return (
    <NonMobile>
      <Animated.View style={{ width }}>
        <View style={styles.tabButtonsContainer}>
          {Object.values(RoomTab).map((tab) => (
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
              <RoomSideBarButton tab={tab} />
            </NotificationBadge>
          ))}
        </View>
        <View style={styles.sideBarView}>
          {currentRoomTab === RoomTab.CHAT && (
            <RoomConversation style={styles.eventConversation} />
          )}
          {currentRoomTab === RoomTab.TOKENS && <TokenSideBar />}
          {currentRoomTab === RoomTab.SETTINGS && <SettingsSideBar />}
          {currentRoomTab === RoomTab.ATTENDEES && <AttendeeSideBar />}
        </View>
      </Animated.View>
    </NonMobile>
  );
}

const createStyles = ({
  sideBarMaxWidth,
}: WithResponsive<{ sideBarMaxWidth: number }>) =>
  StyleSheet.create({
    tabButtonsContainer: {
      position: 'absolute',
      left: -44,
      justifyContent: 'center',
      height: '100%',
      gap: 12,
      pointerEvents: 'box-none',
    },
    sideBarView: {
      width: sideBarMaxWidth,
      height: '100%',
    },
    eventConversation: {
      padding: 20,
    },
  });
