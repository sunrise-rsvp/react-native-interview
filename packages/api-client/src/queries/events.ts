import type {
  CreateEventInput,
  CreatePromoInput,
  Event,
  TemporalRelation,
} from '@sunrise-ui/api/events';
import { useSnackbar } from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { QueryKeys } from '../constants/QueryKeys';
import { eventsApi, promosApi } from '../utils/api';
import { assertParameterIsNotUndefinedOrNull } from '../utils/error';

const { eventsKey, temporalKey, locationKey, byBulkKey } = QueryKeys.events;

export const useGetEvent = (id?: string) =>
  useQuery({
    queryFn: async () => {
      assertParameterIsNotUndefinedOrNull(id, 'id');
      return eventsApi
        .getEventEventsIdGet({
          id,
        })
        .then((response) => response.data);
    },
    queryKey: [eventsKey, id],
    enabled: Boolean(id),
  });

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<Event, unknown, CreateEventInput>({
    async mutationFn(createEventInput: CreateEventInput) {
      const response = await eventsApi.createEventEventsPost({
        createEventInput,
      });
      return response.data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [eventsKey] });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to create event. Please try again.',
        type: 'error',
      });
    },
  });
};

type useGetTemporalOrgEventsArgs = { orgId?: string } & (
  | {
      temporalRelation: TemporalRelation;
      onlyToday?: never;
    }
  | {
      temporalRelation: typeof TemporalRelation.Future;
      onlyToday?: boolean;
    }
);

export const useGetTemporalEvents = ({
  temporalRelation,
  onlyToday,
  orgId = '00000000000000000000000000000000',
}: useGetTemporalOrgEventsArgs) => {
  const queryClient = useQueryClient();
  let select: ((data: Event[]) => Event[]) | undefined;

  if (onlyToday) {
    const now = DateTime.now();
    select = (data) =>
      data?.filter((event) =>
        DateTime.fromISO(event.start_date!).hasSame(now, 'day'),
      );
  }

  return useQuery({
    queryFn: async () => {
      const data = await eventsApi
        .getEventsTemporalEventsTemporalTemporalRelationGet({
          temporalRelation,
          organizationId: orgId,
        })
        .then((response) => response.data);

      data.forEach((event) => {
        queryClient.setQueryData([eventsKey, event.id], event);
      });

      return data;
    },
    queryKey: [eventsKey, temporalKey, temporalRelation, orgId],
    select,
  });
};

export const useGetEventLocation = (eventLocationId?: string) =>
  useQuery({
    queryFn: async () => {
      assertParameterIsNotUndefinedOrNull(eventLocationId, 'eventLocationId');
      return await eventsApi
        .getEventLocationEventsLocationsEventLocationIdGet({
          eventLocationId,
        })
        .then((response) => response.data);
    },
    queryKey: [locationKey, eventLocationId],
    enabled: Boolean(eventLocationId),
  });

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

export const useGetEventLocations = () => {
  return useQuery({
    queryKey: [eventsKey, locationKey],
    queryFn: async () => {
      const response = await eventsApi.listEventLocationsEventsLocationsGet();
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
};

export const useCreatePromo = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (
      createPromoInput: CreatePromoInput & { discount_code: string },
    ) => {
      const response = await promosApi.createPromoPromosPost({
        createPromoInput,
      });
      return response.data;
    },
    onError: () => {
      showSnackbar({
        text: 'Failed to create discount code. Please try again.',
        type: 'error',
      });
    },
  });
};
