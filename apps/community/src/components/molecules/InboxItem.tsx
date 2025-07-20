import ProfileImg from '@atoms/ProfileImg';
import UnreadIndicator from '@atoms/UnreadIndicator';
import Colors from '@constants/Colors';
import { useGetProfile } from '@queries/profiles';
import {
  isAndroid,
  isIos,
  isNative,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { formatDurationFromPastTimestamp } from '@utils/datetime';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  userId: string;
  subtext: string;
  unreadCount?: number;
  timestamp: string;
  onPress: () => void;
  isActive: boolean;
};

export default function InboxItem({
  userId,
  subtext,
  unreadCount,
  timestamp,
  onPress,
  isActive,
}: Props) {
  const styles = useDynamicStyles(createStyles);
  const { data: profile, isLoading: isLoadingProfile } = useGetProfile(userId);
  const unread = Boolean(unreadCount && unreadCount > 0);
  const boldIfUnread = unread ? 'bold' : undefined;
  const [, forceRender] = useState({});

  useFocusEffect(
    useCallback(() => {
      let interval: NodeJS.Timeout;

      if (!isLoadingProfile) {
        interval = setInterval(() => {
          forceRender({});
        }, 5000);
      }

      return () => {
        clearInterval(interval);
      };
    }, [isLoadingProfile]),
  );

  return (
    <LinearGradient
      colors={[
        'transparent',
        isActive ? Colors.dark.opacity05 : 'transparent',
        'transparent',
      ]}
      end={{ x: 1, y: 1 }}
    >
      <TouchableOpacity style={styles.listItemContainer} onPress={onPress}>
        <ProfileImg userId={userId} imgSize="large" styleSize={44} />
        <View style={styles.infoWrapper}>
          {isLoadingProfile ? (
            <View style={styles.skeletonLoader} />
          ) : (
            <TextReg weight={boldIfUnread} style={styles.personName}>
              {profile?.first_name ?? 'Unknown'} {profile?.last_name}
            </TextReg>
          )}
          <TextReg
            weight={boldIfUnread}
            numberOfLines={1}
            style={styles.subtext}
          >
            {subtext}
          </TextReg>
        </View>
        <View style={styles.right}>
          <TextReg weight={boldIfUnread} style={styles.time}>
            {formatDurationFromPastTimestamp(timestamp)}
          </TextReg>
          {unread && <UnreadIndicator count={unreadCount} />}
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    listItemContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 10,
      paddingRight: isMobile ? 12 : isTablet ? 8 : 10,
    },
    skeletonLoader: {
      width: '100%',
      height: isIos ? 17 : isAndroid ? 16 : 18,
      marginBottom: isNative ? 2 : 3,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 8,
      maxWidth: 160,
    },
    infoWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    personName: {
      fontSize: 14,
    },
    subtext: {
      fontSize: 14,
    },
    right: {
      width: 40,
      height: 44,
      // the circle doesn't align properly with the text, so we need to add some padding
      paddingBottom: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    time: {
      fontSize: 14,
    },
    unreadIndicator: {
      width: 10,
      height: 10,
      borderRadius: 10,
      backgroundColor: Colors.dark.yellow0,
    },
  });
