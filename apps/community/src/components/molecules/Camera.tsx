import SquareContainer from '@atoms/SquareContainer';
import WebCamera from '@atoms/WebCamera';
import Colors from '@constants/Colors';
import VideoNameTag from '@molecules/VideoNameTag';
import {
  CameraType,
  MediaDeviceType,
  isWeb,
  useDynamicStyles,
  useIsFocused,
  useMediaDevice,
  useUserAuth,
  type NativeCameraTypes,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { CameraView } from 'expo-camera';
import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  cameraStyle?: StyleProp<ViewStyle>;
  showPersonInfo?: boolean;
  variant?: 'square' | 'flex';
};

export default function Camera({
  children,
  cameraStyle,
  showPersonInfo,
  variant = 'square',
}: PropsWithChildren<Props>) {
  const styles = useDynamicStyles(createStyles, { variant });
  const { currentUserId } = useUserAuth();
  const isFocused = useIsFocused();
  const { deviceId } = useMediaDevice(MediaDeviceType.CAMERA);

  const content = (
    <>
      {isWeb ? (
        <WebCamera style={[styles.camera, cameraStyle]}>{children}</WebCamera>
      ) : (
        <CameraView
          facing={(deviceId as NativeCameraTypes) || CameraType.FRONT}
          style={[styles.camera, cameraStyle]}
        >
          {children}
        </CameraView>
      )}
      {showPersonInfo && <VideoNameTag userId={currentUserId} />}
    </>
  );

  if (!isFocused) return null;

  if (variant === 'flex') {
    return <View style={styles.flexContainer}>{content}</View>;
  }

  return <SquareContainer>{content}</SquareContainer>;
}

const createStyles = ({ variant, isMobile }: WithResponsive<Props>) =>
  StyleSheet.create({
    flexContainer: {
      flex: 1,
    },
    camera: {
      padding: 20,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      borderRadius: variant === 'square' ? 30 : 0,
      overflow: 'hidden',
      flex: 1,
    },
    videoSubtitle: {
      position: 'absolute',
      bottom: 12,
      left: 0,
      backgroundColor: Colors.dark.purple0opacity50,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomRightRadius: isMobile ? 16 : 30,
      borderTopRightRadius: isMobile ? 16 : 30,
    },
  });
