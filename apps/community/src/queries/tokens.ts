import { QueryKeys, gamificationApi } from '@sunrise-ui/api-client';
import { type CreateTokenTransactionInput } from '@sunrise-ui/api/gamification';
import { useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { tokensKey } = QueryKeys.tokens;

export const useGetUserTokens = () => {
  const { currentUserId } = useUserAuth();

  return useQuery({
    async queryFn() {
      const response =
        await gamificationApi.getTokenCountTokensLedgersUsersUserIdCountGet({
          userId: currentUserId,
        });
      return response.data;
    },
    queryKey: [tokensKey, currentUserId],
    enabled: Boolean(currentUserId),
  });
};

export const useCreateTokenTransaction = () => {
  const { currentUserId } = useUserAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      quantity,
    }: Pick<CreateTokenTransactionInput, 'quantity'>) {
      return gamificationApi.createTokenTransactionTokensTransactionsUsersPost({
        createTokenTransactionInput: {
          user_id: currentUserId,
          quantity,
          transaction_type: 'credit',
          reason: 'reward',
        },
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [tokensKey] });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to gift tokens. Please try again.',
        type: 'error',
      });
    },
  });
};
