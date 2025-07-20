import Card from '@atoms/Card';
import Colors from '@constants/Colors';
import useVirtualEventInformation from '@hooks/useVirtualEventInformation';
import AttendeeCircles from '@molecules/AttendeeCircles';
import EventDateDisplay from '@molecules/EventDateDisplay';
import ProfileResult from '@molecules/ProfileResult';
import RoomCardButton from '@molecules/RoomCardButton';
import { useGetRoomByEventId } from '@queries/rooms';
import {
  TextBold,
  TextReg,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type RoomCardProps = {
  eventId: string;
  style?: ViewStyle;
};

export default function RoomCard({ eventId, style }: RoomCardProps) {
  const { data: room } = useGetRoomByEventId(eventId);
  const { isPresent, isFuture } = useVirtualEventInformation(eventId);
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);
  const [dynamicIsPresent, setDynamicIsPresent] = useState(isPresent);
  const { topic_name, topic_description, start_date, user_id } = room ?? {};
  const startDate = DateTime.fromISO(start_date ?? '');

  useEffect(() => {
    if (isFuture) {
      const timeout = setTimeout(() => {
        setDynamicIsPresent(true);
      }, startDate.diffNow().as('milliseconds'));

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isFuture, startDate]);

  const eventInfo = (
    <View style={styles.eventInfo}>
      <ProfileResult userId={user_id} size="medium" />
      <TextBold style={styles.eventTitle}>{topic_name}</TextBold>
      <TextReg style={styles.eventDescription}>{topic_description}</TextReg>
    </View>
  );

  return (
    <Card
      style={[styles.eventCard, style]}
      shadowColor={dynamicIsPresent ? Colors.dark.pink0 : Colors.dark.purple1}
      shadowOpacity={dynamicIsPresent ? 1 : 0.5}
    >
      <View style={styles.topRow}>
        <EventDateDisplay startDate={startDate} />
        {!isMobile && eventInfo}
        <View style={styles.buttonAndAttendeesContainer}>
          <RoomCardButton
            eventId={eventId}
            dynamicIsPresent={dynamicIsPresent}
          />
          <AttendeeCircles eventId={eventId} />
        </View>
      </View>
      {isMobile && eventInfo}
    </Card>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    currentButton: {
      borderRadius: 50,
      width: 86,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    topRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: isMobile ? 12 : isTablet ? 16 : 20,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: '100%',
    },
    eventCard: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
    },
    eventInfo: {
      flexShrink: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
    eventTitle: {
      fontSize: isMobile ? 14 : isTablet ? 20 : 24,
    },
    eventDescription: {
      fontSize: isMobile ? 12 : isTablet ? 14 : 16,
    },
    buttonAndAttendeesContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8,
    },
  });
