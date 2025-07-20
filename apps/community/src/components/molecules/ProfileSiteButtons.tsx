import React from 'react';

import { type ProfileSite } from '@app/(auth)/editProfile';
import {
  GithubIcon,
  Link01Icon,
  Linkedin02Icon,
  NewTwitterIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';
import { useGetProfile } from '@queries/profiles';
import { type ProfileLinks } from '@sunrise-ui/api/profile';
import {
  IconButton,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { openBrowserAsync } from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

type Props = {
  userId: string;
  siteLinks?: ProfileLinks;
  onButtonPress?: (site: ProfileSite) => void;
  onAddPress?: () => void;
};

export default function ProfileSiteButtons({
  userId,
  siteLinks,
  onButtonPress,
  onAddPress,
}: Props) {
  const { isMobile } = useMediaQueries();
  const { isLoading, data: profile } = useGetProfile(userId);
  const styles = useDynamicStyles(createStyles);

  if (isLoading || !profile) return null;

  const links = siteLinks ?? profile.links;

  return (
    <View style={styles.siteLinks}>
      {links?.linkedin && (
        <IconButton
          key="profile-link-linkedin"
          icon={Linkedin02Icon}
          size={isMobile ? 'small' : 'medium'}
          onPress={() => {
            if (onButtonPress) {
              onButtonPress('linkedin');
            } else if (links?.linkedin) {
              void openBrowserAsync(links.linkedin);
            }
          }}
        />
      )}
      {links?.github && (
        <IconButton
          key="profile-link-github"
          icon={GithubIcon}
          size={isMobile ? 'small' : 'medium'}
          onPress={() => {
            if (onButtonPress) {
              onButtonPress('github');
            } else if (links?.github) {
              void openBrowserAsync(links.github);
            }
          }}
        />
      )}
      {links?.x && (
        <IconButton
          key="profile-link-x"
          icon={NewTwitterIcon}
          size={isMobile ? 'small' : 'medium'}
          onPress={() => {
            if (onButtonPress) {
              onButtonPress('x');
            } else if (links?.x) {
              void openBrowserAsync(links.x);
            }
          }}
        />
      )}
      {links?.website && (
        <IconButton
          key="profile-link-website"
          icon={Link01Icon}
          size={isMobile ? 'small' : 'medium'}
          onPress={() => {
            if (onButtonPress) {
              onButtonPress('website');
            } else if (links?.website) {
              void openBrowserAsync(links.website);
            }
          }}
        />
      )}
      {onAddPress && (
        <IconButton
          icon={PlusSignIcon}
          size={isMobile ? 'small' : 'medium'}
          onPress={onAddPress}
        />
      )}
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    siteLinks: {
      display: 'flex',
      flexDirection: 'row',
      gap: isMobile ? 8 : isTablet ? 12 : 20,
    },
  });
