import useMyIntroById from '@hooks/useMyIntroById';
import EmptyState from '@molecules/EmptyState';
import ProfileResult from '@molecules/ProfileResult';
import ProfileSiteButtons from '@molecules/ProfileSiteButtons';
import ProfileStats from '@molecules/ProfileStats';
import IntroActionCard from '@organisms/IntroActionCard';
import IntroList from '@organisms/IntroList';
import {
  type Introduction,
  type MyIntroductionsStates,
} from '@sunrise-ui/api/network';
import {
  NonMobile,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import InboxView from './InboxView';

type Props = {
  intros: Introduction[];
  variant: MyIntroductionsStates;
};

export default function InboxIntroductionView({ intros, variant }: Props) {
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);

  const [activeIntroId, setActiveIntroId] = useState<string>();
  const handleOpenIntro = (id: string) => {
    if (isMobile) {
      router.navigate(`/inbox/intros/${variant}/${id}`);
    } else {
      setActiveIntroId(id);
    }
  };

  const { otherUserHalf } = useMyIntroById({ introId: activeIntroId });

  const emptyStateSubheader =
    variant === 'pending'
      ? 'When someone introduces you to someone else, it will show up here.'
      : variant === 'accepted'
        ? 'When both you and the other person have accepted an introduction, it will show up here.'
        : 'If you or the other person has denied an introduction, it will show up here.';

  return (
    <InboxView>
      {intros.length > 0 ? (
        <IntroList
          intros={intros}
          openIntro={handleOpenIntro}
          activeIntroId={activeIntroId}
        />
      ) : (
        <EmptyState
          header={`No ${variant} introductions yet.`}
          subheader={emptyStateSubheader}
        />
      )}
      {activeIntroId && otherUserHalf && (
        <NonMobile>
          <View style={styles.introContainer}>
            <View style={styles.requesterInfo}>
              <ProfileResult
                userId={otherUserHalf?.person.user_id}
                shouldNavigateOnClick={true}
              />
              <ProfileStats userId={otherUserHalf?.person.user_id} />
              <ProfileSiteButtons userId={otherUserHalf.person.user_id} />
            </View>
            <IntroActionCard introId={activeIntroId} status={variant} />
          </View>
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
    introContainer: {
      width: isMobile ? '100%' : isTablet ? '49%' : '66%',
      display: 'flex',
      flexDirection: 'column',
      gap: 30,
      alignItems: 'center',
    },
    requesterInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 12 : isTablet ? 16 : 20,
    },
  });
