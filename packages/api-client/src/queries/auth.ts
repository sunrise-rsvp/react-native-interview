import type {
  SingleFactorSignInInput,
  VerificationCodeInput,
} from '@sunrise-ui/api/cerebro';
import { type TokenInput, type TokenOutput } from '@sunrise-ui/api/cerebro';
import { storeInfo, useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tokensApi } from '../utils/api';
import { assertParameterIsNotEmptyString } from '../utils/error';

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

export const useSingleFactorSignIn = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    async mutationFn(singleFactorSignInInput: SingleFactorSignInInput) {
      await tokensApi.singleFactorSignInTokensSignInSingleFactorPost({
        singleFactorSignInInput,
      });
    },
    async onError() {
      showSnackbar({
        text: 'Failed to send email. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useSingleFactorValidateCode = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const {
    setCurrentUserId,
    setCurrentRefreshToken,
    setAuthTokenInfo,
    setHasAuthenticated,
  } = useUserAuth();

  return useMutation({
    async mutationFn(verificationCodeInput: VerificationCodeInput) {
      const response =
        await tokensApi.singleFactorCodeValidationTokensSignInSingleFactorValidateCodePost(
          {
            verificationCodeInput,
          },
        );
      return response.data;
    },
    async onSuccess(data) {
      await storeInfo(data);
      setCurrentUserId(data.user_id);
      setCurrentRefreshToken(data.refresh_token);
      setAuthTokenInfo(data.access_token);
      setHasAuthenticated(true);
      await queryClient.invalidateQueries();
    },
    async onError() {
      showSnackbar({
        text: 'Failed to validate code. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useAcceptTerms = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const {
    currentUserId,
    setCurrentUserId,
    setCurrentRefreshToken,
    setAuthTokenInfo,
    setHasAuthenticated,
  } = useUserAuth();

  return useMutation({
    async mutationFn() {
      assertParameterIsNotEmptyString(currentUserId, 'currentUserId');
      const response = await tokensApi.acceptTermsTokensAcceptTermsPost({
        acceptTermsInput: {
          user_id: currentUserId,
        },
      });
      return response.data;
    },
    async onSuccess(data) {
      await storeInfo(data);
      setCurrentUserId(data.user_id);
      setAuthTokenInfo(data.access_token);
      setCurrentRefreshToken(data.refresh_token);
      setHasAuthenticated(true);
      await queryClient.invalidateQueries();
    },
    async onError() {
      showSnackbar({
        text: 'Failed to accept terms. Please try again.',
        type: 'error',
      });
    },
  });
};
