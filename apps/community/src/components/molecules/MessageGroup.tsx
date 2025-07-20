import React from 'react';
import { StyleSheet, View } from 'react-native';

import Message from '@atoms/Message';
import { type Message as MessageModel } from '@sunrise-ui/api/messenger';
import { TextReg, useUserAuth } from '@sunrise-ui/primitives';
import { formatTime, formatVariableDateString } from '@utils/datetime';

type Props = {
  messages: MessageModel[];
};

export default function MessageGroup({ messages }: Props) {
  const { currentUserId } = useUserAuth();

  const styles = StyleSheet.create({
    messageGroupContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
    messageGroupTime: {
      fontSize: 14,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 4,
    },
  });
  const groupTimestamp = messages[messages.length - 1].timestamp ?? '';
  const weekday = formatVariableDateString(groupTimestamp);
  const time = formatTime(groupTimestamp);

  return (
    <View style={styles.messageGroupContainer}>
      <View style={styles.messageGroupTime}>
        <TextReg weight="bold">{weekday}</TextReg>
        <TextReg>{time}</TextReg>
      </View>
      {messages.toReversed().map((message) => (
        <Message
          message={message}
          key={`message-${message._id}`}
          align={message.user_id === currentUserId ? 'right' : 'left'}
        />
      ))}
    </View>
  );
}
