import {
  MediaDeviceType,
  useIsFocused,
  useMediaDevice,
} from '@sunrise-ui/primitives';
import React, {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  style?: StyleProp<ViewStyle>;
};

const WebCamera = ({ children, style }: PropsWithChildren<Props>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFocused = useIsFocused();
  const { deviceId: camera } = useMediaDevice(MediaDeviceType.CAMERA);
  const [stream, setStream] = useState<MediaStream | undefined>();

  const setCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { ideal: camera },
          facingMode: { ideal: 'user' }, // try to set user facing by default
        },
      });
      setStream(stream);
    } catch (e) {
      console.error('setCameraPreview', e);
    }
  };

  useEffect(() => {
    if (stream && videoRef.current && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }

    if (!isFocused) {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    }

    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [stream, isFocused]);

  useEffect(() => {
    if (isFocused) {
      void setCameraPreview();
    }
  }, [camera, isFocused]);

  return (
    <View style={style}>
      <video
        ref={videoRef}
        autoPlay={true}
        id="videoElement"
        muted={true}
        height="100%"
        width="100%"
        style={{
          scale: '-1 1',
          zIndex: '-1',
          position: 'absolute',
          objectFit: 'cover',
        }}
      />
      {children}
    </View>
  );
};

export default WebCamera;
