import { useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { QueryKeys } from '../constants/QueryKeys';
import { profilesApi } from '../utils/api';
import {
  assertParameterIsNotEmptyString,
  assertParameterIsNotUndefinedOrNull,
} from '../utils/error';
import { bulkGetProfiles } from '../utils/profiles';

const { bulkProfilesKey, profileKey, searchKey, blockedUsersKey } =
  QueryKeys.profiles;

export const useBulkGetProfiles = (userIds?: string[]) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryFn: async () => bulkGetProfiles(queryClient, userIds),
    queryKey: [bulkProfilesKey, userIds],
    enabled: Boolean(userIds?.length),
  });
};

export const useSearchProfiles = (searchQuery?: string) =>
  useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      assertParameterIsNotUndefinedOrNull(searchQuery, 'searchQuery');
      const response = await profilesApi.searchProfilesProfilesSearchPost({
        searchProfilesInput: {
          query: searchQuery,
          offset: pageParam,
          limit: 20,
        },
      });
      return { ...response.data, searchQuery };
    },
    initialPageParam: 0,
    getNextPageParam(lastPage): number | undefined {
      if (lastPage?.next) return lastPage.offset + lastPage.limit;
    },
    getPreviousPageParam(lastPage): number | undefined {
      if (lastPage?.previous) return lastPage.offset - lastPage.limit;
    },
    queryKey: [profileKey, searchKey, searchQuery],
    enabled: Boolean(searchQuery && searchQuery.length > 2),
    placeholderData: keepPreviousData,
  });

export const useBlockUser = (userId: string) => {
  const { currentUserId } = useUserAuth();
  const queryClient = useQueryClient();

  const { showSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: async () => {
      assertParameterIsNotEmptyString(currentUserId, 'currentUserId');
      const response = await profilesApi.blockUserProfilesUsersUserIdBlocksPost(
        {
          userId: currentUserId,
          blockedUserInput: {
            blocked_user_id: userId,
          },
        },
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [profileKey, blockedUsersKey, currentUserId],
      });
      showSnackbar({
        text: 'Blocked user',
        type: 'success',
      });
    },
  });
};

export const useGetBlockedUsersProfiles = () => {
  const { currentUserId } = useUserAuth();
  return useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      assertParameterIsNotEmptyString(currentUserId, 'currentUserId');

      const response =
        await profilesApi.getBlockedUsersProfilesUsersUserIdBlocksGet({
          userId: currentUserId,
          offset: pageParam,
          limit: 100,
        });
      return response.data;
    },
    queryKey: [profileKey, blockedUsersKey, currentUserId],
    initialPageParam: 0,
    getNextPageParam(lastPage): number | undefined {
      if (lastPage?.next) return lastPage.offset + lastPage.limit;
    },
    getPreviousPageParam(lastPage): number | undefined {
      if (lastPage?.previous) return lastPage.offset - lastPage.limit;
    },
    staleTime: 600000,
  });
};
