import Colors from '@constants/Colors';
import { ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useParticipants } from '@livekit/components-react';
import {
  TextMono,
  isAndroid,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AttendeeCount() {
  const { isMobile } = useMediaQueries();
  const participants = useParticipants();
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.pill}>
      <HugeiconsIcon
        icon={ViewIcon}
        size={isMobile ? 16 : 24}
        color={Colors.dark.text}
        strokeWidth={2}
      />
      <TextMono style={styles.text}>{participants.length}</TextMono>
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    pill: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: isMobile ? 12 : 16,
      height: isMobile ? 30 : 44,
      borderRadius: 30,
      backgroundColor: Colors.dark.purple0opacity50,
    },
    text: {
      // monospace font has unequal line height, so we need to adjust the padding
      paddingTop: isAndroid ? 0 : 2,
      fontSize: isMobile ? 16 : 24,
    },
  });
