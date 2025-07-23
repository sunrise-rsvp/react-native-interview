import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../constants/QueryKeys';
import { eventsApi } from '../utils/api';
import { assertParameterIsNotUndefinedOrNull } from '../utils/error';

const { eventsKey, byBulkKey } = QueryKeys.events;

export const useGetBulkEvents = (eventIds?: string[]) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryFn: async () => {
      assertParameterIsNotUndefinedOrNull(eventIds, 'eventIds');

      const events = await eventsApi
        .bulkGetEventsByIdEventsBulkPost({
          bulkGetEventsInput: { event_ids: eventIds },
        })
        .then((response) => response.data);

      events.forEach((event) => {
        queryClient.setQueryData([eventsKey, event.id], event);
      });

      return events;
    },
    queryKey: [eventsKey, byBulkKey, eventIds],
    enabled: Boolean(eventIds?.length),
  });
};
