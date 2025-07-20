import ProfileImg from '@atoms/ProfileImg';
import Colors from '@constants/Colors';
import { useGetProfile } from '@queries/profiles';
import { TextBold, TextReg } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  userId?: string;
};

export default function ProfileConversationResult({ userId }: Props) {
  const { data: profile, isLoading } = useGetProfile(userId);

  if (isLoading || !userId)
    return (
      <>
        <ProfileImg userId={userId} imgSize="large" styleSize={150} />
        <View style={[styles.textContainer, styles.infoFiller]}>
          <View style={styles.nameContainerFiller} />
          <View style={styles.headlineFiller} />
          <View style={styles.headlineFiller} />
        </View>
      </>
    );

  return (
    <>
      <ProfileImg userId={userId} imgSize="large" styleSize={150} />
      <View style={styles.textContainer}>
        <View style={styles.nameContainer}>
          <TextBold style={styles.name}>
            {profile?.first_name} {profile?.last_name}
          </TextBold>
          {profile?.pronouns && (
            <TextReg style={styles.pronouns}>({profile?.pronouns})</TextReg>
          )}
        </View>
        <TextReg style={styles.headline}>{profile?.headline}</TextReg>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    rowGap: 0,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  name: {
    fontSize: 36,
    textAlign: 'center',
  },
  pronouns: {
    fontSize: 14,
  },
  headline: {
    fontSize: 20,
    textAlign: 'center',
  },
  infoFiller: {
    gap: 8,
    alignSelf: 'stretch',
  },
  nameContainerFiller: {
    maxWidth: 260,
    height: 36,
    backgroundColor: Colors.dark.opacity20,
    borderRadius: 18,
    width: '100%',
  },
  headlineFiller: {
    maxWidth: 325,
    height: 20,
    backgroundColor: Colors.dark.opacity20,
    borderRadius: 10,
    width: '100%',
  },
});
