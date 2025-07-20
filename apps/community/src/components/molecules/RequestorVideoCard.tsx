import Card from '@atoms/Card';
import PlayableVideoCircle from '@molecules/PlayableVideoCircle';
import {
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  videoUrl?: string;
  userId?: string;
  children: ReactNode;
};

export default function RequestorVideoCard({
  videoUrl,
  userId,
  children,
}: Props) {
  const styles = useDynamicStyles(createStyles);

  return (
    <Card style={styles.container}>
      <PlayableVideoCircle videoUrl={videoUrl} userId={userId} />
      <TextReg style={styles.waitingText}>{children}</TextReg>
    </Card>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      maxWidth: isMobile ? '100%' : isTablet ? '75%' : '50%',
    },
    waitingText: {
      textAlign: 'center',
    },
  });
