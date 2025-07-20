import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import RoomChat from '@molecules/RoomChat';
import SendMessage from '@molecules/SendMessage';
import { isNative, useDynamicStyles } from '@sunrise-ui/primitives';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

type Props = {
  style?: ViewStyle;
};
export default function RoomConversation({ style }: Props) {
  const { currentRoomId } = useCurrentEventInfo();
  const styles = useDynamicStyles(createStyles);

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={50}
    >
      <RoomChat />
      <SendMessage conversationId={currentRoomId} />
    </KeyboardAvoidingView>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      width: '100%',
      flex: 1,
      gap: 20,
      marginBottom: isNative ? 20 : 0,
    },
  });
