import EventCardsList from '@molecules/EventCardsList';
import { useGetBulkRooms } from '@queries/rooms';
import { QueryKeys, useGetTemporalEvents } from '@sunrise-ui/api-client';
import { ExperienceType, TemporalRelation } from '@sunrise-ui/api/events/api';
import { useDynamicStyles } from '@sunrise-ui/primitives';
import { useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const { ticketsKey, byEventIdKey } = QueryKeys.tickets;
const { roomsKey, byEventId } = QueryKeys.rooms;

export default function PublicEventsCardList() {
  const styles = useDynamicStyles(createStyles);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useGetTemporalEvents({ temporalRelation: TemporalRelation.Future });

  // Filter for virtual events and those without existing room query data
  const virtualEventIds = useMemo(
    () =>
      events
        ?.filter(
          (event) =>
            event.experience_type !== ExperienceType.InPerson &&
            queryClient.getQueryData([roomsKey, byEventId, event.id!]) ===
              undefined,
        )
        .map((event) => event.id!),
    [events],
  );

  // Bulk get rooms so individual queries from the card have data instantly
  const { isLoading: isLoadingRooms } = useGetBulkRooms(virtualEventIds);

  const isLoading = !isRefreshing && (isLoadingEvents || isLoadingRooms);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: [ticketsKey, byEventIdKey],
      });
      // TODO: come back to improve refetch here to include rooms
      await refetchEvents();
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
        emptyStateText="No upcoming events"
        cardStyle={styles.eventCard}
      />
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      flex: 1,
    },
    eventCard: {
      marginVertical: 10,
      marginHorizontal: 20,
    },
  });
