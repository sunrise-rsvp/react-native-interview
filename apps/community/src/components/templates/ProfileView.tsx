import ProfileBasicInfo from '@atoms/ProfileBasicInfo';
import ProfileImg from '@atoms/ProfileImg';
import Colors from '@constants/Colors';
import useBlockedUsers from '@contexts/useBlockedUsers';
import useLogout from '@hooks/useLogout';
import { Menu01Icon, PencilEdit01Icon } from '@hugeicons/core-free-icons';
import FollowButton from '@molecules/FollowButton';
import HeaderButton from '@molecules/HeaderButton';
import ProfileSiteButtons from '@molecules/ProfileSiteButtons';
import ProfileStats from '@molecules/ProfileStats';
import UserSettingsModal from '@molecules/UserSettingsModal';
import UserEventsCardList from '@organisms/UserEventsCardList';
import { useGetFollowing, useUnfollowUser } from '@queries/follows';
import { useGetProfile } from '@queries/profiles';
import { useBlockUser } from '@sunrise-ui/api-client';
import { type Profile } from '@sunrise-ui/api/profile';
import {
  Header,
  IconButton,
  Mobile,
  NonMobile,
  TextReg,
  useDynamicStyles,
  useMediaQueries,
  useSetHeader,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { defaultBack } from '@utils/navigation';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Menu } from 'react-native-paper';

export default function ProfileView({ userId }: { userId: string }) {
  const { isMobile, isTablet, isDesktop } = useMediaQueries();
  const { isUserBlocked } = useBlockedUsers();
  const { currentUserId } = useUserAuth();
  const isOwnProfile = userId === currentUserId;
  const { isLoading: isLoadingProfile, data: profile } = useGetProfile(userId);
  const styles = useDynamicStyles(createStyles, { profile });
  const { logout } = useLogout();
  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const { mutateAsync: blockUser } = useBlockUser(userId);
  const { data: following, isLoading: isLoadingFollowing } = useGetFollowing();
  const { mutateAsync: unfollowUser } = useUnfollowUser();

  const isFollowingUser = Boolean(
    following?.find((person) => person.user_id === userId),
  );

  const navigateToEditProfile = () => {
    router.navigate('/editProfile');
  };

  const ownProfileHeader = (
    <Header
      headerLeft={
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <HeaderButton
              icon={Menu01Icon}
              onPress={() => setMenuVisible(true)}
            />
          }
          anchorPosition="bottom"
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setSettingsModalVisible(true);
            }}
            title="Settings"
          />
          <Menu.Item
            onPress={async () => {
              setMenuVisible(false);
              await logout();
            }}
            title="Logout"
          />
        </Menu>
      }
      headerRight={
        !isDesktop ? (
          <HeaderButton
            icon={PencilEdit01Icon}
            onPress={navigateToEditProfile}
          />
        ) : undefined
      }
    />
  );

  const otherProfileHeader = (
    <Header
      headerLeft={<HeaderButton onPress={defaultBack()} />}
      headerRight={
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <HeaderButton
              icon={Menu01Icon}
              onPress={() => setMenuVisible(true)}
            />
          }
          anchorPosition="bottom"
        >
          <Menu.Item
            onPress={async () => {
              setMenuVisible(false);
              if (isFollowingUser) await unfollowUser(userId);
              await blockUser();
              router.navigate('/events');
            }}
            disabled={isLoadingFollowing}
            title="Block"
          />
        </Menu>
      }
    />
  );

  useSetHeader({
    header: () => (isOwnProfile ? ownProfileHeader : otherProfileHeader),
  });

  const nameButton = isOwnProfile ? (
    isDesktop && (
      <IconButton
        icon={PencilEdit01Icon}
        onPress={navigateToEditProfile}
        size="medium"
      />
    )
  ) : (
    <FollowButton userId={userId} />
  );

  if ((!isLoadingProfile && !profile) || isUserBlocked(userId)) {
    return (
      <View style={styles.container}>
        <TextReg>No user here. Creepy.</TextReg>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ProfileImg
          userId={userId}
          imgSize={isMobile ? 'small' : isTablet ? 'medium' : 'large'}
          styleSize={isMobile ? 75 : isTablet ? 225 : 300}
        />
        <View style={styles.profileText}>
          <ProfileBasicInfo
            firstName={profile?.first_name}
            lastName={profile?.last_name}
            pronouns={profile?.pronouns}
            headline={profile?.headline}
            isLoading={isLoadingProfile}
            nameButton={nameButton}
            style={styles.basicInfo}
          />
          <NonMobile>
            <ProfileStats userId={userId} />
            {(profile?.links?.linkedin ??
              profile?.links?.github ??
              profile?.links?.x ??
              profile?.links?.website) && (
              <ProfileSiteButtons userId={userId} />
            )}
          </NonMobile>
        </View>
      </View>
      <Mobile>
        <ProfileStats userId={userId} />
        {(profile?.links?.linkedin ??
          profile?.links?.github ??
          profile?.links?.x ??
          profile?.links?.website) && <ProfileSiteButtons userId={userId} />}
      </Mobile>
      <UserEventsCardList userId={userId} />
      <UserSettingsModal
        visible={settingsModalVisible}
        hideModal={() => setSettingsModalVisible(false)}
      />
    </View>
  );
}

const createStyles = ({
  isMobile,
  isTablet,
  profile,
}: WithResponsive<{ profile?: Profile }>) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: Colors.dark.purple0,
      gap: 20,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      width: '100%',
      flex: 1,
    },
    topSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    profileText: {
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flexShrink: 1,
    },
    basicInfo: {
      maxWidth: '100%',
      width: !profile && isMobile ? 200 : undefined,
    },
  });
