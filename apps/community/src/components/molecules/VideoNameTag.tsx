import ProfileBasicInfo from '@atoms/ProfileBasicInfo';
import { useGetProfile } from '@queries/profiles';
import type { WithResponsive } from '@sunrise-ui/primitives';
import { useDynamicStyles } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';

type Props = {
  userId: string;
  isOnLeft?: boolean;
  isOnBottom?: boolean;
  shouldAnimate?: boolean;
};
export default function VideoNameTag({
  userId,
  isOnLeft = true,
  isOnBottom = true,
  shouldAnimate,
}: Props) {
  const { data: profile } = useGetProfile(userId);
  const styles = useDynamicStyles(createStyles, {
    isOnLeft,
    isOnBottom,
  });
  let enteringAnimation;
  let exitingAnimation;
  if (shouldAnimate) {
    enteringAnimation = (isOnLeft ? SlideInLeft : SlideInRight).duration(800);
    exitingAnimation = (isOnLeft ? SlideOutLeft : SlideOutRight).duration(800);
  }

  if (!profile) return null;

  return (
    <Animated.View
      style={styles.nameTag}
      entering={enteringAnimation}
      exiting={exitingAnimation}
    >
      <ProfileBasicInfo
        firstName={profile.first_name}
        lastName={profile.last_name}
        pronouns={profile.pronouns}
        headline={profile.headline}
        style={styles.profileInfo}
        size="large"
      />
    </Animated.View>
  );
}

const createStyles = ({ isOnLeft, isOnBottom }: WithResponsive<Props>) =>
  StyleSheet.create({
    profileInfo: {
      flexDirection: 'column',
      gap: 8,
      alignItems: isOnLeft ? 'flex-start' : 'flex-end',
    },
    nameTag: {
      position: 'absolute',
      backgroundColor: 'rgba(218, 32, 209, 0.5)',
      paddingHorizontal: 16,
      paddingVertical: 12,
      zIndex: 1,
      bottom: isOnBottom ? 25 : undefined,
      top: isOnBottom ? undefined : 25,
      left: isOnLeft ? 0 : undefined,
      right: isOnLeft ? undefined : 0,
      borderBottomRightRadius: isOnLeft ? 30 : 0,
      borderTopRightRadius: isOnLeft ? 30 : 0,
      borderBottomLeftRadius: isOnLeft ? 0 : 30,
      borderTopLeftRadius: isOnLeft ? 0 : 30,
    },
  });
