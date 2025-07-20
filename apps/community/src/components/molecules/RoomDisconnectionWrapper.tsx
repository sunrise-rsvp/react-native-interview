import useRoomTab from '@contexts/useRoomTab';
import useDisconnectOrLeaveRoom from '@hooks/useDisconnectOrLeaveRoom';
import { useConnectionState } from '@livekit/components-react';
import {
  Button,
  ButtonVariants,
  Header,
  TextReg,
} from '@sunrise-ui/primitives';
import { ConnectionState } from 'livekit-client';
import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

export default function RoomDisconnectionWrapper({
  children,
}: PropsWithChildren) {
  const disconnectOrLeaveRoom = useDisconnectOrLeaveRoom();
  const connectionState = useConnectionState();
  const { setCurrentRoomTab } = useRoomTab();
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  const isDisconnected = connectionState === ConnectionState.Disconnected;

  useEffect(() => {
    if (isDisconnected) setCurrentRoomTab();
  }, [isDisconnected]);

  useEffect(() => {
    if (connectionState === ConnectionState.Connecting)
      setHasAttemptedConnection(true);
  }, [connectionState]);

  if (hasAttemptedConnection && isDisconnected)
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.disconnectedSection}>
          <TextReg style={styles.text}>Disconnected</TextReg>
          <Button
            variant={ButtonVariants.PURPLE}
            onPress={disconnectOrLeaveRoom}
          >
            Leave room
          </Button>
        </View>
      </View>
    );

  return children;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  disconnectedSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  container: {
    height: '100%',
    width: '100%',
  },
});
