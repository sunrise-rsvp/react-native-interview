import useMediaDeviceReadiness from '@hooks/useMediaDeviceReadiness';
import {
  Button,
  ButtonVariants,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  onPressRecord: () => void;
  showModal?: () => void;
};

export default function RecordActionButtons({
  onPressRecord,
  showModal,
}: Props) {
  const { isMobile } = useMediaQueries();
  const { isReadyToRecord } = useMediaDeviceReadiness();
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.actionsWrapper}>
      <Button
        disabled={!isReadyToRecord}
        style={styles.button}
        variant={ButtonVariants.PURPLE}
        size={isMobile ? 'medium' : 'large'}
        onPress={onPressRecord}
      >
        Record
      </Button>
      {showModal && (
        <Button variant={ButtonVariants.CLEAR} size="small" onPress={showModal}>
          Skip for now
        </Button>
      )}
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    actionsWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
    },
    button: {
      width: isMobile ? 120 : 150,
    },
  });
