import {
  MediaDeviceType,
  isWeb,
  useMediaDevice,
  useSnackbar,
} from '@sunrise-ui/primitives';
import { type CameraView } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, type RefObject } from 'react';

export default function useVideoRecorder({
  onStopped,
  nativeCameraRef,
}: {
  onStopped: (uri: string) => void;
  nativeCameraRef: RefObject<CameraView>;
}): {
  startRecording: () => void;
  stopRecording: () => void;
  isRecording: boolean;
} {
  const { showSnackbar } = useSnackbar();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const { deviceId: camera } = useMediaDevice(MediaDeviceType.CAMERA);
  const { deviceId: microphone } = useMediaDevice(MediaDeviceType.MICROPHONE);

  useFocusEffect(
    useCallback(
      () => () => {
        stopRecording();
      },
      [],
    ),
  );

  const startRecording = async () => {
    if (isWeb) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { ideal: camera },
            facingMode: { ideal: 'user' }, // try to set user facing by default
          },
          audio: {
            deviceId: { ideal: microphone },
          },
        });
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm',
          // TODO: research to figure out what these should be
          // audioBitsPerSecond: 128000, // 128 kbps
          // videoBitsPerSecond: 5000000, // Double the default quality from 2.5Mbps to 5Mbps
        });
        setMediaRecorder(mediaRecorder);

        mediaRecorder.start(2000);
        setIsRecording(true);

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          onStopped(url);
        };
      } catch (error) {
        console.error('Error starting web video recording:', error);
        showSnackbar({ text: 'Recording failed to start.', type: 'error' });
      }
    } else {
      if (!nativeCameraRef.current) return;
      const video = await nativeCameraRef.current.recordAsync({
        maxDuration: 20000,
      });

      if (video?.uri) {
        // promise returns once video is stopped
        onStopped(video.uri);
      } else {
        console.error('Error recording video');
        showSnackbar({ text: 'Error recording video', type: 'error' });
      }
    }
  };

  const stopRecording = () => {
    if (isWeb) {
      mediaRecorder?.stop();
    } else {
      nativeCameraRef.current?.stopRecording();
    }

    setIsRecording(false);
  };

  return { startRecording, stopRecording, isRecording };
}
