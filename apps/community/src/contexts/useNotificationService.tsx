import { QueryKeys, updateMessagesCache } from '@sunrise-ui/api-client';
import { type Room } from '@sunrise-ui/api/events';
import {
  type ArcadeAuctionsOutputsGetRoundID,
  type ArcadeRoomExtensionsOutputsGetRoundID,
  type GetCommitmentTotalOutput,
  type GetExtensionPriceOutput,
  type HighestBid,
} from '@sunrise-ui/api/gamification';
import {
  UserRole,
  useSafeContext,
  useSnackbar,
  useUserAuth,
} from '@sunrise-ui/primitives';
import { useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  initialiseNotificationService,
  type NotificationService,
} from '../services/NotificationService';

const { inboxKey } = QueryKeys.inbox;
const { messagesKey, messagesPageSize } = QueryKeys.conversations;
const { eventMessagesKey, eventMessagesPageSize } =
  QueryKeys.eventConversations;
const { roomsKey, byEventId } = QueryKeys.rooms;
const { auctionsKey, highestBid, currentAuctionRound } = QueryKeys.auctions;
const { extensionsKey, price, commitments, currentExtensionRound } =
  QueryKeys.extensions;

export type NotificationServiceContextType = {
  notificationService?: NotificationService;
};

const NotificationServiceContext =
  // @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
  createContext<NotificationServiceContextType>();
NotificationServiceContext.displayName = 'NotificationServiceContext';

export const NotificationServiceProvider = ({
  children,
}: PropsWithChildren) => {
  const { hasAuthenticated, currentUserRole } = useUserAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [notificationService, setNotificationService] =
    useState<NotificationService>();

  useEffect(() => {
    if (hasAuthenticated) {
      const initNotificationService = initialiseNotificationService(() => {
        if (currentUserRole === UserRole.ADMIN) {
          showSnackbar({
            text: 'There was an issue connecting. Retrying',
            type: 'error',
          });
        }
      });

      const removeMessageSentListener = initNotificationService.addListener(
        'MessageSent',
        async (message) => {
          const conversationId = message.conversation_id;
          await queryClient.invalidateQueries({ queryKey: [inboxKey] });
          updateMessagesCache(
            message,
            [messagesKey, conversationId, messagesPageSize],
            queryClient,
          );
          updateMessagesCache(
            message,
            [eventMessagesKey, conversationId, eventMessagesPageSize],
            queryClient,
          );

          // Invalidate after updating cache so that any new query mounted will refetch
          await queryClient.invalidateQueries({
            queryKey: [messagesKey, conversationId, messagesPageSize],
            refetchType: 'none',
          });
        },
      );

      const removeNewExtensionRoundInitiatedListener =
        initNotificationService.addListener(
          'ExtensionAchieved',
          async (event) => {
            queryClient.setQueryData<Room>(
              [roomsKey, event.room_id],
              (room) => {
                if (room) {
                  const newEndDate = DateTime.fromISO(
                    room.scheduled_end_date ?? DateTime.now().toISO(),
                  ).plus({
                    second: Number(event.extend_by_sec),
                  });

                  return {
                    ...room,
                    scheduled_end_date: newEndDate.toISO() ?? '',
                  };
                }
              },
            );
            queryClient.setQueryData<ArcadeRoomExtensionsOutputsGetRoundID>(
              [extensionsKey, currentExtensionRound, event.room_id],
              () => undefined,
            );
            const priceData = queryClient.getQueryData<GetExtensionPriceOutput>(
              [extensionsKey, price, event.room_id],
            );
            queryClient.setQueryData<GetCommitmentTotalOutput>(
              [extensionsKey, commitments, event.room_id],
              () => ({ total: priceData?.price ?? 0 }),
            );
          },
        );

      const removeNewExtensionRoundCreatedListener =
        initNotificationService.addListener(
          'NewExtensionRoundCreated',
          async (event) => {
            queryClient.setQueryData<GetExtensionPriceOutput>(
              [extensionsKey, price, event.room_id],
              () => ({ price: event.price }),
            );
            queryClient.setQueryData<GetCommitmentTotalOutput>(
              [extensionsKey, commitments, event.room_id],
              () => ({ total: 0 }),
            );
            queryClient.setQueryData<ArcadeRoomExtensionsOutputsGetRoundID>(
              [extensionsKey, currentExtensionRound, event.room_id],
              () => ({ round_id: event.round_id }),
            );
          },
        );

      const removeExtensionCommitmentCreatedListener =
        initNotificationService.addListener(
          'ExtensionCommitmentCreated',
          async (event) => {
            const round =
              queryClient.getQueryData<ArcadeRoomExtensionsOutputsGetRoundID>([
                extensionsKey,
                currentExtensionRound,
                event.room_id,
              ]);
            // Guard using the round as this event could occur after the ExtensionAchieved one
            if (round) {
              queryClient.setQueryData<GetCommitmentTotalOutput>(
                [extensionsKey, commitments, event.room_id],
                () => ({ total: event.total }),
              );
            }
          },
        );

      const removeHostJoinedVideoRoomListener =
        initNotificationService.addListener(
          'HostJoinedVideoRoom',
          async (event) => {
            const room = queryClient.getQueryData<Room>([
              roomsKey,
              event.room_id,
            ]);
            const liveRoom = { ...room, is_live: true };
            await queryClient.setQueryData(
              [roomsKey, event.room_id],
              () => liveRoom,
            );
            await queryClient.setQueryData(
              [roomsKey, byEventId, event.event_id],
              () => liveRoom,
            );
          },
        );

      const removeNewAuctionRoundCreatedListener =
        initNotificationService.addListener(
          'NewAuctionRoundCreated',
          async (event) => {
            queryClient.setQueryData<HighestBid>(
              [auctionsKey, highestBid, event.room_id],
              () => ({
                room_id: event.room_id,
                round_id: event.round_id,
                amount: event.price,
              }),
            );

            queryClient.setQueryData<ArcadeAuctionsOutputsGetRoundID>(
              [auctionsKey, currentAuctionRound, event.room_id],
              () => ({
                round_id: event.round_id,
              }),
            );
          },
        );

      const removeNewHighestBidPlacedListener =
        initNotificationService.addListener(
          'NewHighestBidPlaced',
          async (event) => {
            queryClient.setQueryData<HighestBid>(
              [auctionsKey, highestBid, event.room_id],
              () => ({
                room_id: event.room_id,
                round_id: event.round_id,
                amount: event.amount,
                user_id: event.user_id,
              }),
            );
          },
        );

      const removeAuctionRoundClosedListener =
        initNotificationService.addListener(
          'AuctionRoundClosed',
          async (event) => {
            queryClient.setQueryData<ArcadeAuctionsOutputsGetRoundID>(
              [auctionsKey, currentAuctionRound, event.room_id],
              () => undefined,
            );
          },
        );

      setNotificationService(initNotificationService);

      return () => {
        removeMessageSentListener();
        removeNewExtensionRoundCreatedListener();
        removeNewExtensionRoundInitiatedListener();
        removeExtensionCommitmentCreatedListener();
        removeHostJoinedVideoRoomListener();
        removeAuctionRoundClosedListener();
        removeNewHighestBidPlacedListener();
        removeNewAuctionRoundCreatedListener();
        initNotificationService.closeSocket();
      };
    }
  }, [hasAuthenticated]);

  return (
    <NotificationServiceContext.Provider
      value={{
        notificationService,
      }}
    >
      {children}
    </NotificationServiceContext.Provider>
  );
};

export default function useNotificationService() {
  return useSafeContext(NotificationServiceContext);
}
