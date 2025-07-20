import { SentIcon } from '@hugeicons/core-free-icons';
import { useSendMessage } from '@queries/conversations';
import {
  IconButton,
  TextInput,
  useDynamicStyles,
  useSnackbar,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

type Props = {
  conversationId: string;
};

export default function SendMessage({ conversationId }: Props) {
  const styles = useDynamicStyles(createStyles);
  const [message, setMessage] = useState('');
  const { currentUserId } = useUserAuth();
  const { mutateAsync: sendMessage, isPending } = useSendMessage();
  const { showSnackbar } = useSnackbar();

  const handleSend = async () => {
    if (message.length === 0) return;
    try {
      await sendMessage({
        conversationId,
        user_id: currentUserId,
        content: message,
      });
      setMessage('');
    } catch {
      showSnackbar({
        text: 'Message failed to send. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.inputContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={110}
    >
      <TextInput
        style={styles.input}
        label="Message..."
        value={message}
        onChange={setMessage}
        multiline
      />
      <IconButton
        icon={SentIcon}
        onPress={() => {
          void handleSend();
        }}
        size="medium"
        loading={isPending}
      />
    </KeyboardAvoidingView>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    inputContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingRight: isMobile ? 12 : 0,
    },
    input: {
      flexGrow: 1,
      flexShrink: 1,
    },
  });
