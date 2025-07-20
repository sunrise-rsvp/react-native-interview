import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import { QueryKeys, auctionsApi } from '@sunrise-ui/api-client';
import { useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { auctionsKey, highestBid, currentAuctionRound } = QueryKeys.auctions;
const { tokensKey } = QueryKeys.tokens;

export const useGetHighestBid = () => {
  const { currentRoomId } = useCurrentEventInfo();

  return useQuery({
    async queryFn() {
      const response =
        await auctionsApi.getHighestBidAuctionsRoomsRoomIdHighestBidGet({
          roomId: currentRoomId,
        });
      return response.data;
    },
    queryKey: [auctionsKey, highestBid, currentRoomId],
    enabled: Boolean(currentRoomId),
    staleTime: Infinity,
  });
};

export const useGetCurrentAuctionRound = () => {
  const { currentRoomId } = useCurrentEventInfo();

  return useQuery({
    async queryFn() {
      const response =
        await auctionsApi.getRoundIdAuctionsRoomsRoomIdRoundIdGet({
          roomId: currentRoomId,
        });
      return response.data;
    },
    queryKey: [auctionsKey, currentAuctionRound, currentRoomId],
    enabled: Boolean(currentRoomId),
    staleTime: Infinity,
  });
};

export const usePlaceBid = () => {
  const { currentRoomId } = useCurrentEventInfo();
  const { currentUserId } = useUserAuth();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<unknown, unknown, { roundId: string; amount: number }>({
    async mutationFn({ roundId, amount }: { roundId: string; amount: number }) {
      return auctionsApi.placeBidAuctionsRoomsPlaceBidPost({
        placeBidInput: {
          user_id: currentUserId,
          room_id: currentRoomId,
          round_id: roundId,
          amount,
        },
      });
    },
    async onSuccess(_, { roundId, amount }) {
      await queryClient.invalidateQueries({ queryKey: [tokensKey] });
      // don't wait for websocket event to update the highest bid for current user
      queryClient.setQueryData(
        [auctionsKey, highestBid, currentRoomId],
        () => ({
          user_id: currentUserId,
          room_id: currentRoomId,
          round_id: roundId,
          amount,
        }),
      );
    },
    async onError() {
      showSnackbar({
        text: 'Failed to place bid. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useSelectHighestBidder = () => {
  const { currentRoomId } = useCurrentEventInfo();
  const { showSnackbar } = useSnackbar();

  return useMutation<unknown, unknown, { roundId: string; userId: string }>({
    async mutationFn({ roundId, userId }: { roundId: string; userId: string }) {
      return auctionsApi.selectHighestBidderAuctionsRoomsSelectHighestBidderPost(
        {
          selectHighestBidderInput: {
            room_id: currentRoomId,
            round_id: roundId,
            user_id: userId,
          },
        },
      );
    },
    async onError() {
      showSnackbar({
        text: 'Failed to select winner. Please try again.',
        type: 'error',
      });
    },
  });
};
