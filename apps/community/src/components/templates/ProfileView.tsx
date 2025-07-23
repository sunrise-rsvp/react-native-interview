import ProfileBasicInfo from '@atoms/ProfileBasicInfo';
import ProfileImg from '@atoms/ProfileImg';
import Colors from '@constants/Colors';
import useLogout from '@hooks/useLogout';
import { Menu01Icon, PencilEdit01Icon } from '@hugeicons/core-free-icons';
import HeaderButton from '@molecules/HeaderButton';
import ProfileSiteButtons from '@molecules/ProfileSiteButtons';
import ProfileStats from '@molecules/ProfileStats';
import UserEventsCardList from '@organisms/UserEventsCardList';
import { useGetProfile } from '@queries/profiles';
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
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Menu } from 'react-native-paper';

export default function ProfileView({ userId }: { userId: string }) {
  const { isMobile, isTablet, isDesktop } = useMediaQueries();
  const { isLoading: isLoadingProfile, data: profile } = useGetProfile(userId);
  const styles = useDynamicStyles(createStyles, { profile });
  const { logout } = useLogout();
  const [menuVisible, setMenuVisible] = useState(false);

  const navigateToEditProfile = () => {
    router.navigate('/editProfile');
  };

  useSetHeader({
    header: () => (
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
    ),
  });

  const nameButton = isDesktop && (
    <IconButton
      icon={PencilEdit01Icon}
      onPress={navigateToEditProfile}
      size="medium"
    />
  )

  if ((!isLoadingProfile && !profile)) {
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
            <ProfileStats />
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
        <ProfileStats />
        {(profile?.links?.linkedin ??
          profile?.links?.github ??
          profile?.links?.x ??
          profile?.links?.website) && <ProfileSiteButtons userId={userId} />}
      </Mobile>
      <UserEventsCardList userId={userId} />
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
