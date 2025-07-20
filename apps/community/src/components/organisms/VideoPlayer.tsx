import VideoNameTag from '@molecules/VideoNameTag';
import {
  useDynamicStyles,
  useIsFocused,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { ResizeMode, Video, type AVPlaybackStatus } from 'expo-av';
import React, { useRef } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';

type Props = {
  url: string;
  userId: string;
  isLooping?: boolean;
  isMuted?: boolean;
  onFinish?: () => void;
  videoDimension?: DimensionValue;
};

export default function VideoPlayer({
  url,
  userId,
  isLooping,
  isMuted,
  onFinish,
  videoDimension,
}: Props) {
  const styles = useDynamicStyles(createStyles, { videoDimension });
  const isFocused = useIsFocused();

  // expo av video player didJustFinish can be true multiple times, so we need to keep track of it
  const hasFinishedPlaying = useRef(false);
  const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    // The AVPlaybackStatus may be a type that includes `didJustFinish` or not, depending on the playback status.
    // So, it's safe to check if 'didJustFinish' exists and is true.
    if (
      'didJustFinish' in playbackStatus &&
      playbackStatus.didJustFinish &&
      !hasFinishedPlaying.current
    ) {
      hasFinishedPlaying.current = true;
      onFinish?.();
    }
  };

  return (
    <View style={styles.previewContainer}>
      {isFocused && (
        <Video
          source={{ uri: url }}
          rate={1.0}
          volume={1.0}
          resizeMode={ResizeMode.COVER}
          isMuted={isMuted}
          shouldPlay
          isLooping={isLooping}
          style={styles.videoContainer}
          videoStyle={styles.video}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      )}
      <VideoNameTag userId={userId} />
    </View>
  );
}

const createStyles = ({ isMobile, videoDimension }: WithResponsive<Props>) =>
  StyleSheet.create({
    previewContainer: {
      position: 'relative',
    },
    videoContainer: {
      width: videoDimension ? videoDimension : isMobile ? 300 : 450,
      height: videoDimension ? videoDimension : isMobile ? 300 : 450,
      display: 'flex',
      alignItems: 'center',
    },
    video: {
      position: 'relative',
      width: videoDimension ? videoDimension : isMobile ? 300 : 450,
      height: videoDimension ? videoDimension : isMobile ? 300 : 450,
    },
  });
