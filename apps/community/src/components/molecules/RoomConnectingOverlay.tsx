import { useConnectionState } from '@livekit/components-react';
import { Loader, TextReg } from '@sunrise-ui/primitives';
import { ConnectionState } from 'livekit-client';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RoomConnectingOverlay() {
  const connectionState = useConnectionState();

  const isConnecting =
    connectionState === ConnectionState.Connecting ||
    connectionState === ConnectionState.Reconnecting;

  if (isConnecting)
    return (
      <>
        <View style={[styles.overlay, styles.fadedBackground]} />
        <View style={[styles.overlay, styles.container]}>
          <View style={styles.connectingSection}>
            <TextReg style={styles.text}>{connectionState}</TextReg>
            <Loader size={16} style={styles.loader} />
          </View>
        </View>
      </>
    );

  return null;
}

const styles = StyleSheet.create({
  connectingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  loader: { width: 0, flex: 0 },
  text: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: 'box-none',
    zIndex: 0,
  },
  fadedBackground: {
    backgroundColor: '#00000080',
  },
});
