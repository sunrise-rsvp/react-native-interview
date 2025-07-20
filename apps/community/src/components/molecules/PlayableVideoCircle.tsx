import Colors from '@constants/Colors';
import { PlayIcon } from '@hugeicons/core-free-icons';
import { IconButton } from '@sunrise-ui/primitives';
import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  videoUrl?: string;
  userId?: string;
};

export default function PlayableVideoCircle({ videoUrl, userId }: Props) {
  const styles = StyleSheet.create({
    videoContainer: {
      width: 100,
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
    video: {
      width: 100,
      height: 100,
    },
    playButton: {
      position: 'absolute',
      top: 35,
      left: 35,
      backgroundColor: Colors.dark.opacity05,
    },
  });

  if (!videoUrl) return null;

  const playFullScreenVideo = () => {
    router.navigate(
      `/watch?userId=${userId}&video=${encodeURIComponent(videoUrl ?? '')}`,
    );
  };

  return (
    <Pressable onPress={playFullScreenVideo}>
      <View style={styles.video}>
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
        <IconButton
          icon={PlayIcon}
          onPress={playFullScreenVideo}
          style={styles.playButton}
        />
      </View>
    </Pressable>
  );
}
