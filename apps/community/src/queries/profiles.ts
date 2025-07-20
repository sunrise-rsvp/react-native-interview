import { QueryKeys, profilesApi } from '@sunrise-ui/api-client';
import {
  type UpdateProfileInput,
  type UpdateProfileLinksInput,
} from '@sunrise-ui/api/profile';
import {
  getFileFromImage,
  getFileFromUri,
  useSnackbar,
  useUserAuth,
} from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ImagePickerAsset } from 'expo-image-picker';

const { profileKey } = QueryKeys.profiles;

export const useGetProfile = (userId?: string, enabled: boolean = true) =>
  useQuery({
    async queryFn() {
      const response = await profilesApi.getProfileProfilesUsersUserIdGet({
        userId: userId ?? '',
      });
      return response.data;
    },
    queryKey: [profileKey, userId],
    enabled: Boolean(userId) && enabled,
    staleTime: 300000,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn(data: Omit<UpdateProfileInput, 'user_id'>) {
      return profilesApi.updateProfileProfilesPut({
        updateProfileInput: { user_id: currentUserId, ...data },
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [profileKey, currentUserId],
      });
    },
    onError() {
      showSnackbar({
        text: 'Failed to update. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useUpdateProfileLinks = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn(data: UpdateProfileLinksInput) {
      return profilesApi.updateProfileLinksProfilesUsersUserIdLinksPut({
        userId: currentUserId,
        updateProfileLinksInput: data,
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [profileKey, currentUserId],
      });
    },
    onError() {
      showSnackbar({
        text: 'Failed to update. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useUpdateProfilePhoto = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn(image: ImagePickerAsset) {
      const file = (await getFileFromImage(image, currentUserId)) as File;
      return profilesApi.updatePhotoProfilesUsersUserIdPhotosPut({
        userId: currentUserId,
        file,
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [profileKey, currentUserId],
      });
    },
    onError() {
      showSnackbar({
        text: 'Failed to upload. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useUpdateProfileVideo = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn(uri: string) {
      const file = await getFileFromUri(uri, currentUserId);
      return profilesApi.updateVideoProfilesUsersUserIdVideosPut({
        userId: currentUserId,
        file,
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [profileKey, currentUserId],
      });
    },
    onError() {
      showSnackbar({
        text: 'Failed to upload. Please try again.',
        type: 'error',
      });
    },
  });
};
