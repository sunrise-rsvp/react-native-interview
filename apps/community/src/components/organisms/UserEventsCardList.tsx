import EventCardsList from '@molecules/EventCardsList';
import { useGetUserTicketsTemporal } from '@queries/tickets';
import { useGetBulkEvents } from '@sunrise-ui/api-client';
import { TemporalRelation } from '@sunrise-ui/api/events';
import {
  useDynamicStyles,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  userId: string;
};

export default function UserEventsCardList({ userId }: Props) {
  const { currentUserId } = useUserAuth();
  const isSelf = currentUserId === userId;
  const styles = useDynamicStyles(createStyles);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    data: tickets,
    isLoading: isTicketsLoading,
    refetch: refetchTickets,
  } = useGetUserTicketsTemporal({ relation: TemporalRelation.Past, userId });
  const eventIds = useMemo(
    () => tickets?.map((ticket) => ticket.event_id),
    [tickets],
  );
  const { data: events, isLoading: isLoadingEvents } =
    useGetBulkEvents(eventIds);

  const isLoading =
    !isRefreshing && (isTicketsLoading || isLoadingEvents);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchTickets();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <EventCardsList
        events={events}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        emptyStateText={`${isSelf ? 'You have' : 'This user has'} not been to any events yet`}
        cardStyle={styles.eventCard}
      />
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      maxWidth: isMobile ? '100%' : isTablet ? '85%' : '65%',
      flex: 1,
    },
    toggleButtons: {
      maxWidth: 240,
    },
    eventCard: {
      marginVertical: 10,
      marginHorizontal: 10,
    },
  });
