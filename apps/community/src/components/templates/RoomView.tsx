import AttendeeCount from '@atoms/AttendeeCount';
import RoomTimer from '@atoms/RoomTimer';
import useCurrentRoom from '@contexts/useCurrentRoom';
import useNameTagsControl from '@contexts/useNameTagsControl';
import useFollowHost from '@hooks/useFollowHost';
import RoomConnectingOverlay from '@molecules/RoomConnectingOverlay';
import RoomDisconnectionWrapper from '@molecules/RoomDisconnectionWrapper';
import RoomSideBar from '@molecules/RoomSideBar';
import Stage from '@molecules/stage/Stage';
import {
  Header,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { DesktopEventOverlay } from '@templates/DesktopEventOverlay';
import { MobileEventOverlay } from '@templates/MobileEventOverlay';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type FlexDirection = 'row' | 'column';

export default function RoomView() {
  const { flexDirection, setFlexDirection } = useCurrentRoom();
  const { showNameTags } = useNameTagsControl();
  const styles = useDynamicStyles(createStyles, { flexDirection });
  useFollowHost();

  const header = (
    <Header
      headerLeft={<AttendeeCount />}
      headerRight={<RoomTimer />}
      style={styles.header}
    />
  );

  return (
    <RoomDisconnectionWrapper>
      <View
        style={styles.flexContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (width > height) setFlexDirection('row');
          else setFlexDirection('column');
        }}
      >
        <Portal.Host>
          <Stage style={styles.stage} />
          {!showNameTags && <RoomConnectingOverlay />}
          {header}
          {!showNameTags && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.flexContainer}
            >
              <DesktopEventOverlay />
              <MobileEventOverlay />
            </Animated.View>
          )}
        </Portal.Host>
      </View>
      {!showNameTags && <RoomSideBar />}
    </RoomDisconnectionWrapper>
  );
}

const createStyles = ({
  flexDirection,
}: WithResponsive<{ flexDirection: FlexDirection }>) =>
  StyleSheet.create({
    flexContainer: {
      flex: 1,
      pointerEvents: 'box-none',
    },
    stage: {
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      flexDirection,
      zIndex: -1,
    },
    header: {
      backgroundColor: 'transparent',
    },
  });
