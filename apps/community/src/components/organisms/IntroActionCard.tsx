import Stamp from '@atoms/Stamp';
import useMyIntroById from '@hooks/useMyIntroById';
import IntroRequestCard from '@molecules/IntroRequestCard';
import RequestorVideoCard from '@molecules/RequestorVideoCard';
import SendMessageButton from '@molecules/SendMessageButton';
import { useAcceptIntroAsAcceptor } from '@queries/introductions';
import { useGetProfile } from '@queries/profiles';
import {
  type MyIntroductionsStates,
  type State,
} from '@sunrise-ui/api/network';
import {
  Button,
  TextBold,
  useDynamicStyles,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  introId: string;
  status: MyIntroductionsStates;
};

export default function IntroActionCard({ introId, status }: Props) {
  const { currentUserId } = useUserAuth();
  const styles = useDynamicStyles(createStyles);

  const { isAcceptor, currentUserHalf, otherUserHalf } = useMyIntroById({
    introId,
  });
  const { data: introducer } = useGetProfile(
    currentUserHalf?.introduced_to.introducer_id,
  );
  const { data: otherUser } = useGetProfile(otherUserHalf?.person.user_id);

  const { mutateAsync: acceptIntroAsAcceptor, isPending: isAccepting } =
    useAcceptIntroAsAcceptor();

  const handleAccept = async () => {
    if (isAcceptor) {
      await acceptIntroAsAcceptor(introId);
    } else {
      router.navigate(`/inbox/intros/prep/${introId}`);
    }
  };

  if (!currentUserHalf || !otherUser || !introducer) return null;

  const introState = currentUserHalf.introduced_to.state;

  return (
    <>
      {introState === ('video_completed' as State) && (
        <RequestorVideoCard
          videoUrl={currentUserHalf.introduced_to.intro_video_url}
          userId={currentUserId}
        >
          Waiting for{' '}
          <TextBold>
            {introducer.first_name} {introducer.last_name}
          </TextBold>{' '}
          to send your video to{' '}
          <TextBold>
            {otherUser.first_name} {otherUser.last_name}
          </TextBold>
        </RequestorVideoCard>
      )}
      {introState === ('sent_to_acceptor' as State) && (
        <RequestorVideoCard
          videoUrl={currentUserHalf.introduced_to.intro_video_url}
          userId={currentUserId}
        >
          Waiting for{' '}
          <TextBold>
            {otherUser.first_name} {otherUser.last_name}
          </TextBold>{' '}
          to accept
        </RequestorVideoCard>
      )}
      {(introState === ('awaiting_video' as State) ||
        introState === ('awaiting_acceptor' as State)) && (
        <View style={styles.container}>
          <IntroRequestCard introId={introId} withActions />
        </View>
      )}
      {introState === ('accepted' as State) && (
        <>
          <Stamp text="ACCEPTED" />
          <SendMessageButton userId={otherUserHalf?.person.user_id} />
        </>
      )}
      {status === 'denied' && (
        <>
          <Stamp text="DENIED" />
          {/* only show the button if the current user was the one who denied the intro */}
          {introState === ('denied' as State) && (
            <Button onPress={handleAccept} loading={isAccepting}>
              Accept
            </Button>
          )}
        </>
      )}
    </>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      maxWidth: isMobile ? '100%' : isTablet ? '75%' : '50%',
    },
  });
