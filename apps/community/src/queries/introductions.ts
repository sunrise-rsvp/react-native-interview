import { QueryKeys, introductionsApi } from '@sunrise-ui/api-client';
import {
  type IntroductionsApiListIntroductionsMadeByMeIntroductionsUserIdMadeByMeGetRequest,
  type IntroductionsApiListMyIntroductionsIntroductionsUserIdMyIntroductionsGetRequest,
} from '@sunrise-ui/api/network';
import {
  getFileFromUri,
  useSnackbar,
  useUserAuth,
} from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { myIntroductionsKey, introductionsMadeByMeKey } =
  QueryKeys.introductions;

export const useGetMyIntroductions = ({
  userId,
  state,
}: IntroductionsApiListMyIntroductionsIntroductionsUserIdMyIntroductionsGetRequest) =>
  useQuery({
    async queryFn() {
      const response =
        await introductionsApi.listMyIntroductionsIntroductionsUserIdMyIntroductionsGet(
          {
            userId,
            state,
          },
        );
      return response.data;
    },
    queryKey: [myIntroductionsKey, state],
    enabled: Boolean(userId),
  });

export const useGetIntroductionsMadeByMe = ({
  userId,
  state,
}: IntroductionsApiListIntroductionsMadeByMeIntroductionsUserIdMadeByMeGetRequest) =>
  useQuery({
    async queryFn() {
      const response =
        await introductionsApi.listIntroductionsMadeByMeIntroductionsUserIdMadeByMeGet(
          {
            userId,
            state,
          },
        );
      return response.data;
    },
    queryKey: [introductionsMadeByMeKey, state],
  });

type IntroducerInput = {
  requestorId: string;
  acceptorId: string;
  message: string;
};

export const useCreateIntro = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn({ requestorId, acceptorId, message }: IntroducerInput) {
      return introductionsApi.introduceUsersIntroductionsPost({
        introducedToInput: {
          introduced_person_1_id: requestorId,
          introduced_person_2_id: acceptorId,
          introducer_id: currentUserId,
          introducer_message: message,
        },
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [introductionsMadeByMeKey, 'pending'],
      });
    },
    onError() {
      showSnackbar({
        text: 'Failed to create intro. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useDenyIntro = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn(id: string) {
      return introductionsApi.denyIntroductionIntroductionsDenyPost({
        denyIntroInput: { id, user_id: currentUserId },
      });
    },
    async onSuccess() {
      // TODO: this should be invalidated based on whether the intro was made by me or not
      await queryClient.invalidateQueries({ queryKey: [myIntroductionsKey] });
      await queryClient.invalidateQueries({
        queryKey: [introductionsMadeByMeKey],
      });
    },
    onError() {
      showSnackbar({
        text: 'Failed to deny intro. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useAcceptIntroAsRequestor = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn({ uri, introId }: { uri: string; introId: string }) {
      const file = await getFileFromUri(uri, currentUserId);
      return introductionsApi.requestorAcceptIntroductionIntroductionsRequestorAcceptPost(
        {
          file,
          introId,
          userId: currentUserId,
        },
      );
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [myIntroductionsKey] });
    },
    onError() {
      showSnackbar({
        text: 'Failed to accept intro. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useAcceptIntroAsIntroducer = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn({ requestorId, acceptorId, message }: IntroducerInput) {
      return introductionsApi.introducerAcceptIntroductionIntroductionsIntroducerAcceptPost(
        {
          introducerAcceptIntroInput: {
            introduced_user_1_id: requestorId,
            introduced_user_2_id: acceptorId,
            introducer_id: currentUserId,
            introducer_message: message,
          },
        },
      );
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [introductionsMadeByMeKey],
      });
    },
    onError() {
      showSnackbar({
        text: 'Failed to send. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useAcceptIntroAsAcceptor = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn(id: string) {
      return introductionsApi.acceptorAcceptIntroductionIntroductionsAcceptorAcceptPost(
        {
          acceptIntroInput: { id, user_id: currentUserId },
        },
      );
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [myIntroductionsKey] });
    },
    onError() {
      showSnackbar({
        text: 'Failed to accept intro. Please try again.',
        type: 'error',
      });
    },
  });
};
