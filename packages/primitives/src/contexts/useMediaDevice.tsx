import {
  useCameraPermissions,
  useMicrophonePermissions,
  type PermissionResponse,
} from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { CameraType } from '../constants/CameraType';
import { MediaDeviceError, MediaDeviceType } from '../utils/media';
import { isNative, isWeb } from '../utils/responsivity';

type MediaDeviceContextType = {
  deviceId: string;
  setDeviceId: React.Dispatch<React.SetStateAction<string>>;
  permission?: PermissionResponse;
  requestPermission: () => Promise<void>;
  isReadyToUse: boolean;
  availableDevices: MediaDeviceInfo[];
  error?: MediaDeviceError;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const CameraDeviceContext = createContext<MediaDeviceContextType>();
// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const MicrophoneDeviceContext = createContext<MediaDeviceContextType>();

export const MediaDeviceProvider = ({
  children,
  mediaDeviceType,
}: PropsWithChildren<{ mediaDeviceType: MediaDeviceType }>) => {
  const isCamera = mediaDeviceType === MediaDeviceType.CAMERA;
  const Context = isCamera ? CameraDeviceContext : MicrophoneDeviceContext;
  const [deviceId, setDeviceId] = useState<string>('');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    [],
  );

  const [error, setError] = useState<MediaDeviceError | undefined>();

  const permission = isCamera ? cameraPermission : microphonePermission;
  const handleRequestPermission = isCamera
    ? requestCameraPermission
    : requestMicrophonePermission;

  const isReadyToUse = Boolean(deviceId && permission?.granted && !error);

  const getAvailableDevices = useCallback(async () => {
    const availableDevices = await navigator.mediaDevices
      .enumerateDevices()
      .then((list) =>
        list.filter(
          (mediaDevice) =>
            mediaDevice.kind === (isCamera ? 'videoinput' : 'audioinput'),
        ),
      );
    setAvailableDevices(availableDevices);

    if (!availableDevices.length) {
      setError(MediaDeviceError.NONE_DETECTED);
      setDeviceId('');
    }

    if (
      !availableDevices.some((mediaDevice) => mediaDevice.deviceId === deviceId)
    ) {
      const defaultDevice =
        availableDevices.find(
          (mediaDevice) => mediaDevice.deviceId === 'default',
        ) ?? availableDevices[0];
      setDeviceId(defaultDevice?.deviceId);
    }
  }, [isCamera, setAvailableDevices, deviceId, setDeviceId, setError]);

  useEffect(() => {
    if (isWeb) {
      navigator.mediaDevices.addEventListener(
        'devicechange',
        getAvailableDevices,
      );

      return () => {
        navigator.mediaDevices.removeEventListener(
          'devicechange',
          getAvailableDevices,
        );
      };
    }
  }, [getAvailableDevices]);

  const requestPermission = async () => {
    if (permission && !permission?.canAskAgain) {
      setError(MediaDeviceError.CANNOT_REQUEST_PERMISSION_AGAIN);
      setDeviceId('');
    } else if (!permission || permission.canAskAgain) {
      const permissionResponse = await handleRequestPermission();
      if (permissionResponse.granted) {
        setError(undefined);
        if (isWeb) await getAvailableDevices();
        if (isNative && !deviceId)
          setDeviceId(isCamera ? CameraType.FRONT : 'device-microphone');
      } else {
        setError(MediaDeviceError.DENIED_ACCESS);
        setDeviceId('');
      }
    }
  };

  return (
    <Context.Provider
      value={{
        deviceId,
        setDeviceId,
        permission: permission ?? undefined,
        requestPermission,
        isReadyToUse,
        availableDevices,
        error,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useMediaDevice = (mediaDeviceType?: MediaDeviceType) => {
  const context = useContext(
    mediaDeviceType === MediaDeviceType.CAMERA
      ? CameraDeviceContext
      : MicrophoneDeviceContext,
  );

  if (!context)
    console.error(
      `Component used outside of MediaDeviceProvider for ${mediaDeviceType}`,
    );

  useFocusEffect(
    useCallback(() => {
      if (!context?.permission?.granted) {
        void context?.requestPermission();
      }
    }, []),
  );

  return context;
};
