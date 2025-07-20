import Colors from '@constants/Colors';
import useIntroHalves from '@hooks/useIntroHalves';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import IntroHalfStatus from '@molecules/IntroHalfStatus';
import { type IntroductionHalf } from '@sunrise-ui/api/network';
import {
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { formatDurationFromPastTimestamp } from '@utils/datetime';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  introHalves: IntroductionHalf[];
};

export default function IntroStatusCard({ introHalves }: Props) {
  const styles = useDynamicStyles(createStyles);

  const { requestor, acceptor } = useIntroHalves({ introHalves });

  if (!requestor || !acceptor) return null;

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        router.navigate(`/introduce?id=${requestor.introduced_to.id}`);
      }}
    >
      <IntroHalfStatus
        userId={requestor.person.user_id}
        status={requestor.introduced_to.read_status}
      />
      <View style={styles.center}>
        <View style={styles.connector}>
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            color={Colors.dark.text}
            size={16}
          />
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            color={Colors.dark.text}
            size={16}
          />
        </View>
        <TextReg>
          {formatDurationFromPastTimestamp(
            (requestor.introduced_to.created_date as string) ?? '',
          )}
        </TextReg>
      </View>
      <IntroHalfStatus
        userId={acceptor.person.user_id}
        status={acceptor.introduced_to.read_status}
      />
    </Pressable>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: isMobile ? '100%' : isTablet ? '80%' : '50%',
      paddingVertical: isMobile ? 12 : isTablet ? 16 : 20,
      backgroundColor: Colors.dark.opacity05,
      borderRadius: isMobile ? 16 : 30,
    },
    center: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    },
    connector: {
      display: 'flex',
      flexDirection: 'row',
      gap: isMobile ? 0 : 4,
    },
  });
