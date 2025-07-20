import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import { QueryKeys, extensionsApi } from '@sunrise-ui/api-client';
import { type GetCommitmentTotalOutput } from '@sunrise-ui/api/gamification';
import { useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { extensionsKey, commitments, price, currentExtensionRound } =
  QueryKeys.extensions;
const { tokensKey } = QueryKeys.tokens;

export const useGetTotalCommitment = () => {
  const { currentRoomId } = useCurrentEventInfo();

  return useQuery({
    async queryFn() {
      const response =
        await extensionsApi.getCommitmentTotalExtensionsRoomsRoomIdCommitmentsTotalGet(
          {
            roomId: currentRoomId,
          },
        );
      return response.data;
    },
    queryKey: [extensionsKey, commitments, currentRoomId],
    enabled: Boolean(currentRoomId),
    staleTime: Infinity,
  });
};

export const useGetExtensionPrice = () => {
  const { currentRoomId } = useCurrentEventInfo();

  return useQuery({
    async queryFn() {
      const response =
        await extensionsApi.getExtensionPriceExtensionsRoomsRoomIdPriceGet({
          roomId: currentRoomId,
        });
      return response.data;
    },
    queryKey: [extensionsKey, price, currentRoomId],
    enabled: Boolean(currentRoomId),
    staleTime: Infinity,
  });
};

export const useGetCurrentExtensionRound = () => {
  const { currentRoomId } = useCurrentEventInfo();

  return useQuery({
    async queryFn() {
      const response =
        await extensionsApi.getRoundIdExtensionsRoomsRoomIdRoundIdGet({
          roomId: currentRoomId,
        });
      return response.data;
    },
    queryKey: [extensionsKey, currentExtensionRound, currentRoomId],
    enabled: Boolean(currentRoomId),
  });
};

export const useCommitToExtension = () => {
  const { currentRoomId } = useCurrentEventInfo();
  const { currentUserId } = useUserAuth();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<
    unknown,
    unknown,
    { roundId: string; value: number; newTotal: number }
  >({
    async mutationFn({
      roundId,
      value,
    }: {
      roundId: string;
      value: number;
      newTotal: number;
    }) {
      return extensionsApi.createExtensionCommitmentExtensionsRoomsCommitmentsPost(
        {
          createExtensionCommitmentInput: {
            user_id: currentUserId,
            room_id: currentRoomId,
            round_id: roundId,
            value,
          },
        },
      );
    },
    async onSuccess(_, { newTotal }) {
      await queryClient.invalidateQueries({ queryKey: [tokensKey] });
      // don't wait for websocket event to update the total for current user
      queryClient.setQueryData<GetCommitmentTotalOutput>(
        [extensionsKey, commitments, currentRoomId],
        () => ({ total: newTotal }),
      );
    },
    async onError() {
      showSnackbar({
        text: 'Failed to commit tokens. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useCreateExtension = () => {
  const { currentRoomId } = useCurrentEventInfo();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn() {
      return extensionsApi.createNewRoundExtensionsRoomsRoomIdRoundPost({
        roomId: currentRoomId,
      });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to create extension. Please try again.',
        type: 'error',
      });
    },
  });
};
