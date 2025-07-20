import Colors from '@constants/Colors';
import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import useDisconnectOrLeaveRoom from '@hooks/useDisconnectOrLeaveRoom';
import { useGetRoom } from '@queries/rooms';
import {
  TextMono,
  isAndroid,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { getRoomTimeLeft } from '@utils/timing';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function RoomTimer() {
  const { currentRoomId } = useCurrentEventInfo();
  const { data: room, isLoading } = useGetRoom(currentRoomId);
  const { isFinished, isAlmostFinished, minutesLeft, secondsLeft } =
    getRoomTimeLeft(room);

  const [, forceRender] = useState(false);
  const styles = useDynamicStyles(createStyles, {
    isAlmostFinished,
  });
  const disconnectOrLeaveRoom = useDisconnectOrLeaveRoom();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isLoading) {
      if (isFinished) {
        void disconnectOrLeaveRoom();
      } else {
        interval = setInterval(() => {
          forceRender((prevState) => !prevState);
        }, 1000);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [isFinished, isLoading]);

  return (
    <View style={styles.pill}>
      <TextMono style={styles.text}>
        {isLoading || !room
          ? '--:--'
          : isFinished
            ? '0:00'
            : `${minutesLeft}:${secondsLeft}`}
      </TextMono>
    </View>
  );
}

const createStyles = ({
  isMobile,
  isAlmostFinished,
}: WithResponsive<{ isAlmostFinished: boolean }>) =>
  StyleSheet.create({
    pill: {
      backgroundColor: isAlmostFinished
        ? Colors.dark.pink0opacity50
        : Colors.dark.purple0opacity50,
      paddingHorizontal: isMobile ? 12 : 16,
      // monospace font has unequal line height, so we need to adjust the padding
      paddingTop: isAndroid ? 0 : isMobile ? 2 : 4,
      height: isMobile ? 30 : 44,
      borderRadius: 30,
      // readjust the width to be correct despite outer container's smaller width
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: isMobile ? 16 : 24,
    },
  });
