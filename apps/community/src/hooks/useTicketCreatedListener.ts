import useNotificationService from '@contexts/useNotificationService';
import { QueryKeys } from '@sunrise-ui/api-client';
import { TemporalRelation } from '@sunrise-ui/api/events/api';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { TicketCreated } from '../services/NotificationService';

const { ticketsKey, byEventIdKey, temporalKey } = QueryKeys.tickets;

export default function useTicketCreatedListener() {
  const { notificationService } = useNotificationService();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (notificationService) {
      const removeListener = notificationService.addListener(
        'TicketCreated',
        async (ticketCreated: TicketCreated) => {
          await queryClient.invalidateQueries({
            queryKey: [ticketsKey, byEventIdKey, ticketCreated.event_id],
          });
          await queryClient.invalidateQueries({
            queryKey: [
              ticketsKey,
              temporalKey,
              TemporalRelation.Future,
              ticketCreated.user_id,
            ],
          });
          await queryClient.invalidateQueries({
            queryKey: [
              ticketsKey,
              temporalKey,
              TemporalRelation.Past,
              ticketCreated.user_id,
            ],
          });
        },
      );

      return () => {
        removeListener();
      };
    }
  }, [notificationService]);
}
