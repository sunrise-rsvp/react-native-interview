import Card from '@atoms/Card';
import Colors from '@constants/Colors';
import { Copy01Icon } from '@hugeicons/core-free-icons';
import EventDateDisplay from '@molecules/EventDateDisplay';
import {
  IconButton,
  TextBold,
  TextReg,
  useDynamicStyles,
  useSnackbar,
  type WithResponsive
} from '@sunrise-ui/primitives';
import * as Clipboard from 'expo-clipboard';
import type { DateTime } from 'luxon';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  title?: string;
  description?: string;
  startDate: DateTime;
  style?: ViewStyle;
};

export default function InPersonEventCard({
                                            title,
                                            startDate,
                                            description,
                                            style
                                          }: Props) {
  const styles = useDynamicStyles(createStyles);
  const { showSnackbar } = useSnackbar();

  const addressString = '2947 Juniper Hollow Lane, Brooksville Heights, WY, 82932 USA';

  const copyToClipboard = () => {
    void Clipboard.setStringAsync(addressString).then(() => {
      showSnackbar({
        type: 'success',
        text: 'Address copied'
      });
    });
  };

  const addressDisplay =
    <View style={styles.addressContainer}>
      <TextReg style={styles.addressAndDescription} numberOfLines={1}>
        2947 Juniper Hollow Lane
      </TextReg>
      <IconButton
        icon={Copy01Icon}
        onPress={copyToClipboard}
        style={styles.copyButton}
      />
    </View>;

  return (
    <Card
      style={[styles.eventCard, style]}
      shadowColor={Colors.dark.purple1}
      shadowOpacity={0.5}
    >
      <View style={styles.topRow}>
        <EventDateDisplay startDate={startDate} />
      </View>
      <View style={styles.eventInfo}>
        <TextBold style={styles.title} numberOfLines={1}>
          {title}
        </TextBold>
        {addressDisplay}
        <TextReg style={styles.addressAndDescription} numberOfLines={4}>
          {description}
        </TextReg>
      </View>
    </Card>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    topRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: isMobile ? 12 : 20,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: '100%'
    },
    eventCard: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      minWidth: 200,
      maxWidth: 400,
      height: isMobile ? undefined : 321,
      flex: 1
    },
    eventInfo: {
      gap: isMobile ? 8 : 12,
      width: '100%'
    },
    title: {
      fontSize: isMobile ? 20 : 24
    },
    addressAndDescription: {
      fontSize: isMobile ? 14 : 16
    },
    copyButton: {
      backgroundColor: 'transparent'
    },
    buttonAndAttendeesContainer: {
      alignItems: 'flex-end',
      gap: isMobile ? 4 : 8
    },
    locationSkeleton: {
      maxWidth: 250,
      height: 16,
      backgroundColor: Colors.dark.opacity20,
      borderRadius: 8,
      marginVertical: 7
    },
    addressContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 }
  });
