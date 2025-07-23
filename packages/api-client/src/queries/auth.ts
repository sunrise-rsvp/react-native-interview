import { type TokenInput, type TokenOutput } from '@sunrise-ui/api/cerebro';
import { storeInfo} from '@sunrise-ui/primitives';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tokensApi } from '../utils/api';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<TokenOutput, unknown, TokenInput>({
    async mutationFn(tokenInput) {
      const response = await tokensApi.apiLoginForAccessTokenTokensApiPost({
        tokenInput,
      });
      return response.data;
    },
    async onSuccess(data) {
      await storeInfo(data);

      await queryClient.invalidateQueries();
    },
  });
};
