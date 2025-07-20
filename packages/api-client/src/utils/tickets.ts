import type { Ticket } from '@sunrise-ui/api/events/api';
import type { QueryClient, QueryKey } from '@tanstack/react-query';

export async function updateUserCheckInStatus({
  userId,
  queryClient,
  ticketsQueryKey,
  checkInStatus,
}: {
  userId: string;
  queryClient: QueryClient;
  ticketsQueryKey: QueryKey;
  checkInStatus: boolean;
}) {
  await queryClient.cancelQueries({ queryKey: ticketsQueryKey });

  const previousTickets = queryClient.getQueryData<Ticket[]>(ticketsQueryKey);

  queryClient.setQueryData<Ticket[]>(ticketsQueryKey, (oldTickets) => {
    if (!oldTickets) return oldTickets;

    const ticketToUpdateIndex = oldTickets?.findIndex(
      (ticket) => ticket.user_id === userId,
    );

    if (ticketToUpdateIndex === -1) return oldTickets;

    const updatedTickets = [...oldTickets];
    updatedTickets[ticketToUpdateIndex] = {
      ...updatedTickets[ticketToUpdateIndex],
      is_checked_in: checkInStatus,
    };

    return updatedTickets;
  });

  return { previousTickets };
}
