import { QueryKeys, tokensApi, versionsApi } from '@sunrise-ui/api-client';
import { storeInfo, useSnackbar } from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CustomerIO } from '@utils/CustomerIO';

const { versionsKey } = QueryKeys.versions;

export const useSingleFactorValidation = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(token: string) {
      const response =
        await tokensApi.singleFactorTokenValidationTokensSignInSingleFactorValidateTokenPost(
          {
            token,
          },
        );
      return response.data;
    },
    async onSuccess(data, token) {
      await storeInfo(data);

      if (CustomerIO) {
        void CustomerIO.identify({
          userId: data.user_id,
          traits: { email: token },
        });
      }

      await queryClient.invalidateQueries();
    },
    async onError() {
      showSnackbar({
        text: 'Failed to validate token. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useCheckVersion = (enabled: boolean) =>
  useQuery({
    async queryFn() {
      const response = await versionsApi.listActiveVersionsVersionsGet();
      return response.data;
    },
    queryKey: [versionsKey],
    staleTime: Infinity,
    enabled,
  });
