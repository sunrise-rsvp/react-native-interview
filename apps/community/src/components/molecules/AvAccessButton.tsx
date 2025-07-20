import TodoButton from '@atoms/TodoButton';
import Colors from '@constants/Colors';
import {
  CameraType,
  Dropdown,
  MediaDeviceType,
  isNative,
  useDynamicStyles,
  useMediaDevice,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  variant: MediaDeviceType;
};

export default function AvAccessButton({ variant }: Props) {
  const styles = useDynamicStyles(createStyles);
  const {
    deviceId,
    setDeviceId,
    requestPermission,
    availableDevices,
    isReadyToUse,
  } = useMediaDevice(variant);

  if (!isReadyToUse)
    return (
      <TodoButton done={false} onPress={requestPermission}>
        {`Set Up ${variant.charAt(0).toUpperCase() + variant.slice(1)}`}
      </TodoButton>
    );

  if (isNative)
    return (
      <TodoButton done={true} onPress={() => []}>
        {variant === MediaDeviceType.CAMERA &&
          (deviceId === CameraType.FRONT ? 'Front camera' : 'Back camera')}
        {variant === MediaDeviceType.MICROPHONE && 'Device microphone'}
      </TodoButton>
    );

  return (
    <Dropdown
      placeholder={`Select a ${variant}`}
      value={deviceId}
      options={availableDevices.map((device) => ({
        label: device.label,
        value: device.deviceId,
      }))}
      onChange={(value) => {
        setDeviceId(value ?? '');
      }}
      notClearable
      buttonStyle={styles.button}
      menuStyle={styles.dropdown}
      variant="slim"
      todo
      done
    />
  );
}

const createStyles = () =>
  StyleSheet.create({
    button: {
      backgroundColor: Colors.dark.opacity20,
    },
    dropdown: {
      width: '100%',
    },
  });
