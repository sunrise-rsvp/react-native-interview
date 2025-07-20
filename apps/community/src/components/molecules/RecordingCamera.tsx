import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Colors from '@constants/Colors';
import useVideoRecorder from '@hooks/useVideoRecorder';
import {
  TextMono,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { formatSecondsAsClockTime } from '@utils/datetime';
import { CameraView } from 'expo-camera';

type Props = {
  onRecordingFinished: (uri: string) => void;
};

export default function RecordingCamera({ onRecordingFinished }: Props) {
  const [currentTime, setCurrentTime] = useState(-3);
  const styles = useDynamicStyles(createStyles, { currentTime });

  const nativeCameraRef = useRef<CameraView>(null);
  const { startRecording, stopRecording, isRecording } = useVideoRecorder({
    nativeCameraRef,
    onStopped: onRecordingFinished,
  });

  useEffect(() => {
    // Start counting when component mounts
    const countupInterval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(countupInterval);
    };
  }, []);

  if (currentTime > -1 && currentTime < 20 && !isRecording) {
    startRecording();
  }

  if (currentTime > 19 && isRecording) {
    stopRecording();
  }

  return (
    <View style={styles.timer}>
      <TextMono style={styles.timerText}>
        {formatSecondsAsClockTime(currentTime)}
      </TextMono>
      <CameraView ref={nativeCameraRef} />
    </View>
  );
}

const createStyles = ({
  isMobile,
  currentTime,
}: WithResponsive<{ currentTime: number }>) =>
  StyleSheet.create({
    timer: {
      paddingTop: isMobile ? 14 : 16,
      paddingBottom: 12,
      paddingHorizontal: 20,
      backgroundColor:
        Number(currentTime) > 0 ? Colors.dark.purple1 : Colors.dark.opacity20,
      borderRadius: 100,
      width: isMobile ? 120 : 150,
    },
    timerText: {
      fontSize: isMobile ? 24 : 36,
      textAlign: 'center',
    },
  });
