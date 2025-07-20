import useMyIntroById from '@hooks/useMyIntroById';
import ProfileResult from '@molecules/ProfileResult';
import ProfileSiteButtons from '@molecules/ProfileSiteButtons';
import ProfileStats from '@molecules/ProfileStats';
import IntroActionCard from '@organisms/IntroActionCard';
import { type MyIntroductionsStates } from '@sunrise-ui/api/network';
import { useSearchParams } from '@sunrise-ui/primitives';
import { useSegments } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function IntroductionView() {
  const { introId } = useSearchParams<{ introId: string }>();
  const segments = useSegments();
  const status = segments.slice(-2)[0] as MyIntroductionsStates;
  const { otherUserHalf } = useMyIntroById({ introId });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 30,
    },
    profile: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
  });

  if (!otherUserHalf) return null;

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <ProfileResult
          userId={otherUserHalf?.person.user_id}
          shouldNavigateOnClick={true}
        />
        <ProfileStats userId={otherUserHalf?.person.user_id} />
        <ProfileSiteButtons userId={otherUserHalf?.person.user_id} />
      </View>
      <IntroActionCard introId={introId} status={status} />
    </View>
  );
}
