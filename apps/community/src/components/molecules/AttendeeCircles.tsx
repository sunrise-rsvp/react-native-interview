import ProfileImg from '@atoms/ProfileImg';
import { TicketTypes } from '@constants/TicketTypes';
import { useGetTicketTypes } from '@queries/tickets';
import { useGetTicketsByEventId } from '@sunrise-ui/api-client';
import { type Ticket } from '@sunrise-ui/api/events';
import {
  TextReg,
  useDynamicStyles,
  useMediaQueries,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  numberToDisplay?: number;
};

export default function AttendeeCircles({
  eventId,
  numberToDisplay = 4,
}: Props) {
  const { currentUserId } = useUserAuth();
  const styles = useDynamicStyles(createStyles);
  const { data: tickets } = useGetTicketsByEventId(eventId);
  const { data: ticketTypes } = useGetTicketTypes(eventId);
  const { isMobile } = useMediaQueries();

  const attendeeTicketType = ticketTypes?.find(
    (type) => type.name === TicketTypes.GENERAL_ADMISSION,
  );

  const filteredTickets = useMemo(() => {
    if (!tickets || !attendeeTicketType) return undefined;

    return tickets.filter(
      (ticket) => ticket.ticket_type_id === attendeeTicketType?.id,
    );
  }, [tickets, attendeeTicketType, currentUserId]);

  const getAttendeeCircle = (ticket: Ticket) => (
    <ProfileImg
      key={ticket.user_id}
      userId={ticket.user_id}
      imgSize="thumbnail_large"
      styleSize={isMobile ? 30 : 40}
      style={styles.profileImg}
    />
  );

  return (
    <View style={styles.container}>
      {filteredTickets
        ?.slice(0, numberToDisplay - 1)
        ?.map((ticket) => getAttendeeCircle(ticket))}
      {filteredTickets?.length === numberToDisplay &&
        getAttendeeCircle(filteredTickets[numberToDisplay - 1])}
      {filteredTickets && filteredTickets.length > numberToDisplay && (
        <View style={styles.photoContainer}>
          <TextReg style={styles.moreAttendees}>
            +{filteredTickets?.length - numberToDisplay + 1}
          </TextReg>
        </View>
      )}
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
    },
    photoContainer: {
      backgroundColor: '#65106a',
      width: isMobile ? 30 : 40,
      height: isMobile ? 30 : 40,
      borderRadius: isMobile ? 15 : 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: isMobile ? -15 : -25,
    },
    moreAttendees: {
      fontSize: isMobile ? 10 : 12,
    },
    profileImg: {
      marginLeft: isMobile ? -15 : -25,
      backgroundColor: '#65106a',
    },
  });
