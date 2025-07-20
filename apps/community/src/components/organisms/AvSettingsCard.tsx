import TodoButton from '@atoms/TodoButton';
import useMediaDeviceReadiness from '@hooks/useMediaDeviceReadiness';
import AvAccessButton from '@molecules/AvAccessButton';
import Camera from '@molecules/Camera';
import {
  MediaDeviceType,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  withExample?: boolean;
  maxCameraSize?: number;
};
export default function AvSettingsCard({
  withExample = true,
  maxCameraSize,
}: Props) {
  const { errorMessage } = useMediaDeviceReadiness();
  const [watchedIntro, setWatchedIntro] = useState(false);
  const styles = useDynamicStyles(createStyles, { maxCameraSize });

  return (
    <View style={styles.container}>
      <Camera cameraStyle={styles.camera}>
        <AvAccessButton variant={MediaDeviceType.CAMERA} />
        <AvAccessButton variant={MediaDeviceType.MICROPHONE} />
        {withExample && (
          <TodoButton
            done={watchedIntro}
            onPress={() => {
              setWatchedIntro(true);
            }}
          >
            Watch Example Intro
          </TodoButton>
        )}
      </Camera>
      {errorMessage && (
        <TextReg style={styles.deniedError}>{errorMessage}</TextReg>
      )}
    </View>
  );
}

const createStyles = ({ maxCameraSize }: WithResponsive<Props>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
      maxHeight: maxCameraSize ? maxCameraSize : undefined,
      maxWidth: maxCameraSize ? maxCameraSize : undefined,
    },
    deniedError: {
      padding: 10,
      textAlign: 'center',
    },
    camera: {
      gap: 32,
    },
  });
