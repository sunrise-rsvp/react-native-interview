import ProfileConversationResult from '@molecules/ProfileConversationResult';
import ProfileResult from '@molecules/ProfileResult';
import ProfileStats from '@molecules/ProfileStats';
import SendMessage from '@molecules/SendMessage';
import Conversation from '@organisms/Conversation';
import ConversationList from '@organisms/ConversationList';
import { type ConnectionType } from '@sunrise-ui/api/messenger';
import {
  Desktop,
  NonMobile,
  Tablet,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import InboxView from './InboxView';

type Props = {
  connectionType: ConnectionType;
};

export default function InboxConversationView({ connectionType }: Props) {
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);

  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [activeUserId, setActiveUserId] = useState<string>();
  const handleOpenConversation = (conversationId: string, userId: string) => {
    if (isMobile) {
      router.navigate(`/inbox/${connectionType}/${conversationId}`);
    } else {
      setActiveConversationId(conversationId);
      setActiveUserId(userId);
    }
  };
  const hasActiveConversation = activeConversationId && activeUserId;

  return (
    <InboxView>
      <View style={styles.equalWidthContainer}>
        <ConversationList
          openConversation={handleOpenConversation}
          activeConversationId={activeConversationId}
          connectionType={connectionType}
        />
      </View>
      {hasActiveConversation && (
        <NonMobile>
          <View
            style={[styles.equalWidthContainer, styles.conversationContainer]}
          >
            <Tablet>
              <View style={styles.tabletHeader}>
                <ProfileResult
                  userId={activeUserId}
                  shouldNavigateOnClick={true}
                />
                <ProfileStats userId={activeUserId} />
              </View>
            </Tablet>
            <Conversation id={activeConversationId} />
            <SendMessage conversationId={activeConversationId} />
          </View>
          <Desktop>
            <View style={[styles.equalWidthContainer, styles.profileContainer]}>
              <ProfileConversationResult userId={activeUserId} />
              <ProfileStats userId={activeUserId} align="vertical" />
            </View>
          </Desktop>
        </NonMobile>
      )}
    </InboxView>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: isMobile ? 0 : isTablet ? 16 : 20,
      paddingHorizontal: isMobile ? 0 : isTablet ? 16 : 20,
      paddingBottom: isMobile ? 12 : isTablet ? 16 : 20,
    },
    equalWidthContainer: {
      width: isMobile ? '100%' : isTablet ? '49%' : '33%',
    },
    conversationContainer: {
      gap: 12,
    },
    profileContainer: {
      gap: 20,
      display: 'flex',
      alignItems: 'center',
      paddingRight: 12,
    },
    tabletHeader: {
      display: 'flex',
      gap: 16,
      paddingHorizontal: 16,
    },
  });
