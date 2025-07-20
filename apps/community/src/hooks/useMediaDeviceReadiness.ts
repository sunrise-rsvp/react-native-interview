import {
  MediaDeviceType,
  getErrorMessage,
  useMediaDevice,
  type MediaDeviceError,
} from '@sunrise-ui/primitives';

type ReturnType = {
  isReadyToRecord: boolean;
  cameraError?: MediaDeviceError;
  microphoneError?: MediaDeviceError;
  errorMessage?: string;
};

export default function useMediaDeviceReadiness(): ReturnType {
  const { isReadyToUse: isCameraReady, error: cameraError } = useMediaDevice(
    MediaDeviceType.CAMERA,
  );
  const { isReadyToUse: isMicReady, error: microphoneError } = useMediaDevice(
    MediaDeviceType.MICROPHONE,
  );
  const errorMessage =
    getErrorMessage(MediaDeviceType.CAMERA, cameraError) ??
    getErrorMessage(MediaDeviceType.MICROPHONE, microphoneError);

  return {
    isReadyToRecord: isMicReady && isCameraReady,
    cameraError,
    microphoneError,
    errorMessage,
  };
}
