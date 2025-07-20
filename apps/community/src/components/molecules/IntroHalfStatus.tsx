import ProfileImg from '@atoms/ProfileImg';
import { useGetProfile } from '@queries/profiles';
import { TextBold, TextReg, useMediaQueries } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  userId: string;
  status: string;
};

export default function IntroHalfStatus({ userId, status }: Props) {
  const { isMobile } = useMediaQueries();
  const styles = StyleSheet.create({
    introSide: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center',
      width: '40%',
    },
    text: {
      textAlign: 'center',
    },
  });

  const { data: profile, isLoading } = useGetProfile(userId);

  if (isLoading || !profile) return null;

  return (
    <View style={styles.introSide}>
      <ProfileImg
        userId={userId}
        imgSize="large"
        styleSize={isMobile ? 50 : 60}
      />
      <View>
        <TextBold style={styles.text}>
          {profile.first_name} {profile.last_name}
        </TextBold>
        <TextReg style={styles.text}>{status || '...'}</TextReg>
      </View>
    </View>
  );
}
