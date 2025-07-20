import useBlockedUsers from '@contexts/useBlockedUsers';
import { QueryKeys, followsApi } from '@sunrise-ui/api-client';
import { type Person } from '@sunrise-ui/api/network';
import { useSnackbar, useUserAuth } from '@sunrise-ui/primitives';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

const { followingKey, followersKey } = QueryKeys.follows;
const { relationshipStatsKey } = QueryKeys.people;

type Props = {
  silenceErrors?: boolean;
};

export const useFollowUser = ({ silenceErrors }: Props = {}) => {
  const { currentUserId } = useUserAuth();
  const invalidateFollowsAndStats = useInvalidateFollowsAndStats();
  const { showSnackbar } = useSnackbar();

  return useMutation<Person, unknown, string>({
    async mutationFn(userId: string) {
      const response = await followsApi.followUserFollowsPost({
        followsInput: {
          follower_id: currentUserId,
          followed_id: userId,
        },
      });
      return response.data;
    },
    async onSuccess(_, userId) {
      await invalidateFollowsAndStats(currentUserId, userId);
    },
    async onError() {
      if (!silenceErrors) {
        showSnackbar({
          text: 'Failed to follow user. Please try again.',
          type: 'error',
        });
      }
    },
  });
};

export const useUnfollowUser = () => {
  const { currentUserId } = useUserAuth();
  const invalidateFollowsAndStats = useInvalidateFollowsAndStats();
  const { showSnackbar } = useSnackbar();

  return useMutation<Person, unknown, string>({
    async mutationFn(userId: string) {
      const response = await followsApi.unfollowUserFollowsUnfollowPost({
        followsInput: {
          follower_id: currentUserId,
          followed_id: userId,
        },
      });
      return response.data;
    },
    async onSuccess(_, userId) {
      await invalidateFollowsAndStats(currentUserId, userId);
    },
    async onError() {
      showSnackbar({
        text: 'Failed to unfollow user. Please try again.',
        type: 'error',
      });
    },
  });
};

export const useGetFollowing = () => {
  const { currentUserId } = useUserAuth();
  const { isLoading: isLoadingBlockedUsers, isUserBlocked } = useBlockedUsers();

  const {
    isLoading: isLoadingFollowing,
    data,
    ...otherProps
  } = useQuery({
    queryFn: async () =>
      followsApi
        .getFollowingFollowsUserIdFollowingGet({
          userId: currentUserId,
        })
        .then((response) => response.data),
    queryKey: [followingKey, currentUserId],
    enabled: !isLoadingBlockedUsers,
  });

  const filteredData = useMemo(
    () => data?.filter((user) => !isUserBlocked(user.user_id)),
    [data, isUserBlocked],
  );

  return {
    isLoading: isLoadingFollowing || isLoadingBlockedUsers,
    data: filteredData,
    ...otherProps,
  };
};

export const useGetFollowers = ({ userId }: { userId: string }) => {
  const { isLoading: isLoadingBlockedUsers, isUserBlocked } = useBlockedUsers();

  const {
    isLoading: isLoadingFollowers,
    data,
    ...otherProps
  } = useQuery({
    async queryFn() {
      return followsApi
        .getFollowersFollowsUserIdFollowersGet({
          userId,
        })
        .then((response) => response.data);
    },
    queryKey: [followersKey, userId],
    enabled: !isLoadingBlockedUsers,
  });

  const filteredData = useMemo(
    () => data?.filter((user) => !isUserBlocked(user.user_id)),
    [data, isUserBlocked],
  );

  return {
    isLoading: isLoadingFollowers || isLoadingBlockedUsers,
    data: filteredData,
    ...otherProps,
  };
};

const useInvalidateFollowsAndStats = () => {
  const queryClient = useQueryClient();
  return async (currentUserId: string, otherUserId: string) => {
    await queryClient.invalidateQueries({
      queryKey: [followingKey, currentUserId],
    });
    await queryClient.invalidateQueries({
      queryKey: [followersKey, otherUserId],
    });
    await queryClient.invalidateQueries({
      queryKey: [relationshipStatsKey, currentUserId],
    });
    await queryClient.invalidateQueries({
      queryKey: [relationshipStatsKey, otherUserId],
    });
  };
};
