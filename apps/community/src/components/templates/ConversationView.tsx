import ProfileResult from '@molecules/ProfileResult';
import ProfileStats from '@molecules/ProfileStats';
import SendMessage from '@molecules/SendMessage';
import Conversation from '@organisms/Conversation';
import { useGetConversationById } from '@queries/conversations';
import {
  TextReg,
  useDynamicStyles,
  useSearchParams,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Params = {
  conversationId: string;
};

export default function ConversationView() {
  const { conversationId } = useSearchParams<Params>();
  const styles = useDynamicStyles(createStyles);

  const { currentUserId } = useUserAuth();
  const { data: conversation, isLoading: isLoadingConversation } =
    useGetConversationById({
      conversationId,
    });
  const otherUserId = conversation?.users?.find((id) => id !== currentUserId);

  if (!isLoadingConversation && !conversation)
    return (
      <View style={styles.missingContainer}>
        <TextReg>Conversation not found</TextReg>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <ProfileResult userId={otherUserId} shouldNavigateOnClick={true} />
        <ProfileStats userId={otherUserId} />
      </View>
      <Conversation id={conversationId} />
      <SendMessage conversationId={conversationId} />
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    missingContainer: {
      padding: 12,
      alignItems: 'center',
    },
    container: {
      flex: 1,
      padding: 12,
      paddingRight: isMobile ? 0 : 6,
      gap: 12,
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingRight: 12,
    },
  });
