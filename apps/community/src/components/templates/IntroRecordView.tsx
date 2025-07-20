import React from 'react';
import { StyleSheet, View } from 'react-native';

import RecordingCamera from '@molecules/RecordingCamera';
import {
  Button,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';

type Props = {
  onRecordingFinished: (uri: string) => void;
  handleBack: () => void;
};
export default function IntroRecordView({
  onRecordingFinished,
  handleBack,
}: Props) {
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.container}>
      <RecordingCamera onRecordingFinished={onRecordingFinished} />
      <TextReg style={styles.text}>Look directly at your camera.</TextReg>
      <Button onPress={handleBack}>Cancel</Button>
    </View>
  );
}

const createStyles = ({ isMobile, isTablet, isDesktop }: WithResponsive) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: isMobile ? 30 : 60,
    },
    text: {
      maxWidth: isDesktop ? '70%' : '80%',
      fontSize: isMobile ? 64 : isTablet ? 96 : 128,
      textAlign: 'center',
    },
  });
