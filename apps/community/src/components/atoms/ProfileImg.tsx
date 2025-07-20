import Colors from '@constants/Colors';
import { UserCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useGetProfile } from '@queries/profiles';
import { type ProfilePhoto } from '@sunrise-ui/api/profile';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  userId?: string;
  imgSize: keyof Omit<ProfilePhoto, 'user_id' | 'is_active'>;
  styleSize: number;
  tempUrl?: string;
  forcePhoto?: boolean;
  shouldNavigateOnClick?: boolean;
  style?: ViewStyle;
};

export default function ProfileImg({
  userId,
  imgSize = 'small',
  styleSize,
  tempUrl,
  forcePhoto = true,
  style,
}: Props) {
  const { isLoading, data: profile } = useGetProfile(userId);
  const videoUrl = profile?.videos?.[imgSize];
  const imgUrl = tempUrl ?? profile?.photos?.[imgSize];
  const isDisplayingVideo = videoUrl && !forcePhoto;
  const styles = useDynamicStyles(createStyles, {
    styleSize,
    hasOnClick: Boolean(isDisplayingVideo),
  });

  const handleOnPress = () => {
    if (isDisplayingVideo) {
      router.navigate(
        `/watch?userId=${userId}&video=${encodeURIComponent(videoUrl ?? '')}`,
      );
    }
  };

  if (!userId || isLoading || !imgUrl)
    return (
      <View style={[styles.photoContainer, style]}>
        <HugeiconsIcon
          icon={UserCircleIcon}
          color={Colors.dark.text}
          size={styleSize}
          strokeWidth={1}
        />
      </View>
    );

  return (
    <View style={[styles.photoContainer, style]}>
      <TouchableOpacity onPress={handleOnPress}>
        {isDisplayingVideo ? (
          <Video
            source={{ uri: videoUrl }}
            rate={1.0}
            volume={1.0}
            resizeMode={ResizeMode.COVER}
            isMuted
            shouldPlay
            isLooping
            style={styles.videoContainer}
            videoStyle={styles.video}
          />
        ) : (
          <Image
            source={{ uri: imgUrl }}
            aria-label={`${profile?.first_name} ${profile?.last_name} Profile Photo`}
            style={styles.photo}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const createStyles = ({
  styleSize,
  hasOnClick,
}: WithResponsive<Props & { hasOnClick: boolean }>) =>
  StyleSheet.create({
    photoContainer: {
      backgroundColor: Colors.dark.opacity05,
      width: styleSize,
      height: styleSize,
      borderRadius: styleSize,
      pointerEvents: hasOnClick ? undefined : 'none',
    },
    photo: {
      width: styleSize,
      height: styleSize,
      borderRadius: styleSize,
    },
    videoContainer: {
      width: styleSize,
      height: styleSize,
      display: 'flex',
      alignItems: 'center',
    },
    video: {
      position: 'relative',
    },
  });
