import Card from '@atoms/Card';
import Colors from '@constants/Colors';
import useMyIntroById from '@hooks/useMyIntroById';
import PlayableVideoCircle from '@molecules/PlayableVideoCircle';
import { useAcceptIntroAsAcceptor, useDenyIntro } from '@queries/introductions';
import { useGetProfile } from '@queries/profiles';
import {
  Button,
  TextBold,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  introId: string;
  withActions?: boolean;
};

export default function IntroRequestCard({ introId, withActions }: Props) {
  const { currentUserHalf, otherUserHalf, isAcceptor } = useMyIntroById({
    introId,
  });
  const { data: introducer } = useGetProfile(
    currentUserHalf?.introduced_to.introducer_id,
  );
  const styles = useDynamicStyles(createStyles, { isAcceptor });

  const { isPending: isAcceptingIntro, mutateAsync: acceptIntro } =
    useAcceptIntroAsAcceptor();
  const { isPending: isDenyingIntro, mutateAsync: denyIntro } = useDenyIntro();

  const handleAccept = async () => {
    await acceptIntro(introId);
  };

  const handleDeny = async () => {
    await denyIntro(introId);
  };

  if (!currentUserHalf || !otherUserHalf || !introducer) return null;

  return (
    <Card>
      <View style={styles.requestInfo}>
        <View style={styles.requestText}>
          <TextReg>
            {isAcceptor ? 'Introduced by ' : 'Intro Video Request from '}
            <TextBold>
              {introducer.first_name} {introducer.last_name}
            </TextBold>
          </TextReg>
          <TextReg>{currentUserHalf.introduced_to.introducer_message}</TextReg>
        </View>
        {isAcceptor && (
          <PlayableVideoCircle
            videoUrl={otherUserHalf.introduced_to.intro_video_url}
            userId={otherUserHalf.person.user_id}
          />
        )}
      </View>
      {withActions && (
        <View style={styles.requestActions}>
          <Button loading={isDenyingIntro} onPress={handleDeny}>
            Deny
          </Button>
          {isAcceptor ? (
            <Button loading={isAcceptingIntro} onPress={handleAccept}>
              Accept
            </Button>
          ) : (
            <Button
              onPress={() => {
                router.navigate(`/inbox/intros/prep/${introId}`);
              }}
            >
              Record Video
            </Button>
          )}
        </View>
      )}
    </Card>
  );
}

const createStyles = ({
  isMobile,
  isTablet,
  isAcceptor,
}: WithResponsive<{ isAcceptor: boolean }>) =>
  StyleSheet.create({
    requestInfo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    requestText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: isAcceptor
        ? isMobile
          ? '70%'
          : isTablet
            ? '60%'
            : '66%'
        : '100%',
    },
    video: {
      width: 100,
      height: 100,
      backgroundColor: Colors.dark.opacity05,
      borderRadius: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    requestActions: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: isMobile ? 12 : isTablet ? 16 : 20,
    },
  });
