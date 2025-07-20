import EmptyState from '@molecules/EmptyState';
import IntroStatusCard from '@organisms/IntroStatusCard';
import { useGetIntroductionsMadeByMe } from '@queries/introductions';
import { useBulkGetProfiles } from '@sunrise-ui/api-client';
import { type IntroductionsByMeStates } from '@sunrise-ui/api/network';
import { Loader, useMediaQueries, useUserAuth } from '@sunrise-ui/primitives';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function IntrosMadeView({
  state,
}: {
  state: IntroductionsByMeStates;
}) {
  const { currentUserId } = useUserAuth();
  const { isLoading: isLoadingIntros, data: introductions } =
    useGetIntroductionsMadeByMe({
      userId: currentUserId,
      state,
    });

  const { isMobile, isTablet } = useMediaQueries();
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      alignItems: 'center',
      gap: isMobile ? 12 : isTablet ? 16 : 20,
      minHeight: '100%',
    },
  });

  const uniqueUserIdsToGet = [
    ...new Set(
      introductions
        ?.map((intro) =>
          intro.introduction
            .map((iHalf) => [
              iHalf.person.user_id,
              iHalf.introduced_to.introducer_id,
            ])
            .flat(),
        )
        .flat(),
    ),
  ];
  const { isLoading: isLoadingProfiles } =
    useBulkGetProfiles(uniqueUserIdsToGet);

  if (isLoadingIntros || isLoadingProfiles) return <Loader size="large" />;

  const emptyStateSubheader =
    state === 'pending'
      ? 'When you introduce someone to someone else, it will show up here.'
      : state === 'accepted'
        ? 'When both of the people you introduce accept it, it will show up here.'
        : 'When one of the people you introduce denies it, it will show up here.';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {introductions && introductions.length > 0 ? (
        introductions.map((intro) => (
          <IntroStatusCard
            key={`made-intro-${intro.introduction[0].introduced_to.id}`}
            introHalves={intro.introduction}
          />
        ))
      ) : (
        <EmptyState
          header={`No ${state} intros made yet.`}
          subheader={emptyStateSubheader}
        />
      )}
    </ScrollView>
  );
}
