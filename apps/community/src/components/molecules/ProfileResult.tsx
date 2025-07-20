import ProfileBasicInfo from '@atoms/ProfileBasicInfo';
import ProfileImg from '@atoms/ProfileImg';
import useNavigateToProfile from '@hooks/useNavigateToProfile';
import FollowButton from '@molecules/FollowButton';
import { useGetProfile } from '@queries/profiles';
import {
  useDynamicStyles,
  useMediaQueries,
  useUserAuth,
} from '@sunrise-ui/primitives';
import React, { type PropsWithChildren } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

type Props = {
  userId?: string;
  shouldNavigateOnClick?: boolean;
  size?: 'small' | 'medium';
  showFollowButton?: boolean;
  style?: ViewStyle;
};

export default function ProfileResult({
  userId,
  shouldNavigateOnClick,
  children,
  showFollowButton,
  size = 'medium',
  style,
}: PropsWithChildren<Props>) {
  const { currentUserId } = useUserAuth();
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);
  const navigateToProfile = useNavigateToProfile(userId);
  const { data: profile } = useGetProfile(userId);
  const isSelf = currentUserId === userId;

  const content = (
    <>
      <ProfileImg
        userId={userId}
        imgSize="large"
        styleSize={isMobile || size === 'small' ? 50 : 95}
        shouldNavigateOnClick
      />
      <ProfileBasicInfo
        firstName={profile?.first_name}
        lastName={profile?.last_name}
        pronouns={profile?.pronouns}
        headline={profile?.headline}
        isLoading={!profile}
        size={size}
        nameButton={
          showFollowButton && !isSelf && <FollowButton userId={userId} />
        }
      />
      {children}
    </>
  );

  if (shouldNavigateOnClick)
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={navigateToProfile}
      >
        {content}
      </TouchableOpacity>
    );

  return <View style={[styles.container, style]}>{content}</View>;
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      flexGrow: 1,
      flexShrink: 1,
    },
    textContainer: {
      display: 'flex',
      // flex: 1,
    },
  });
