import Colors from '@constants/Colors';
import {
  useGetConversationUnread,
  useMarkConversationRead,
  useReportMessage,
} from '@queries/conversations';
import { type Message as MessageModel } from '@sunrise-ui/api/messenger';
import {
  Loader,
  TextBold,
  TextReg,
  useDynamicStyles,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Menu } from 'react-native-paper';

type Props = {
  message: MessageModel;
  align: 'left' | 'right';
};

export default function Message({ message, align }: Props) {
  const styles = useDynamicStyles(createStyles, { align });
  const { currentUserId } = useUserAuth();
  const isMessageSentBySelf = currentUserId === message.user_id;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { mutateAsync: markMessagesRead } = useMarkConversationRead(
    message.conversation_id,
  );
  const { data: unread } = useGetConversationUnread({
    conversationId: message.conversation_id,
  });
  const { mutateAsync: reportMessage, isPending } = useReportMessage();

  const hasUnreadMessagesBelow = Boolean(
    unread &&
      unread.unread_count > 0 &&
      unread.last_read_message_id === message._id,
  );

  useEffect(() => {
    if (hasUnreadMessagesBelow) {
      const timeout = setTimeout(() => {
        void markMessagesRead();
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [hasUnreadMessagesBelow]);

  const unreadMessagesSection = hasUnreadMessagesBelow && (
    <View style={styles.newContainer}>
      <View style={styles.newLine} />
      <TextBold style={styles.newText}>New</TextBold>
    </View>
  );

  if (isMessageSentBySelf)
    return (
      <>
        <View style={styles.outerContainer}>
          <View style={styles.messageContainer}>
            <TextReg style={styles.message}>{message.content}</TextReg>
          </View>
        </View>
        {unreadMessagesSection}
      </>
    );

  return (
    <>
      <View style={styles.outerContainer}>
        <Menu
          visible={isMenuVisible}
          onDismiss={() => {
            setIsMenuVisible(false);
          }}
          anchor={
            <TouchableOpacity
              onLongPress={() => {
                setIsMenuVisible(true);
              }}
            >
              <View style={styles.messageContainer}>
                {isPending && <Loader size={16} />}
                <TextReg style={styles.message}>
                  {isPending ? 'Reporting message' : message.content}
                </TextReg>
              </View>
            </TouchableOpacity>
          }
          anchorPosition="bottom"
        >
          <Menu.Item
            onPress={async () => {
              setIsMenuVisible(false);
              await reportMessage(message._id!);
            }}
            title="Report"
          />
        </Menu>
      </View>
      {unreadMessagesSection}
    </>
  );
}

const createStyles = ({ isMobile, align }: WithResponsive<Props>) =>
  StyleSheet.create({
    newContainer: {
      position: 'relative',
      height: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    newLine: {
      width: '100%',
      height: 1,
      backgroundColor: Colors.dark.yellow0,
    },
    newText: {
      position: 'absolute',
      backgroundColor: Colors.dark.purple0,
      paddingHorizontal: 8,
      textAlign: 'center',
      color: Colors.dark.yellow0,
    },
    messageContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderRadius: 30,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: Colors.dark.opacity05,
    },
    message: {
      fontSize: 14,
    },
    outerContainer: {
      alignSelf: align === 'right' ? 'flex-end' : 'flex-start',
      maxWidth: isMobile ? '85%' : '75%',
    },
  });
