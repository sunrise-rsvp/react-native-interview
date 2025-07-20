import { UserAdd01Icon, UserBlock01Icon } from '@hugeicons/core-free-icons';
import {
  useFollowUser,
  useGetFollowing,
  useUnfollowUser,
} from '@queries/follows';
import { IconButton } from '@sunrise-ui/primitives';
import React from 'react';

type Props = {
  userId?: string;
};
export default function FollowButton({ userId }: Props) {
  const { mutateAsync: followUser, isPending: isPendingFollow } =
    useFollowUser();
  const { mutateAsync: unfollowUser, isPending: isPendingUnfollow } =
    useUnfollowUser();
  const { isLoading: isLoadingFollowing, data: following } = useGetFollowing();

  const isFollowingUser = Boolean(
    following?.find((person) => person.user_id === userId),
  );

  const isLoading =
    isLoadingFollowing || isPendingFollow || isPendingUnfollow || !userId;

  return isFollowingUser ? (
    <IconButton
      icon={UserBlock01Icon}
      onPress={() => {
        if (userId) void unfollowUser(userId);
      }}
      loading={isLoading}
      disabled={isLoading}
    />
  ) : (
    <IconButton
      icon={UserAdd01Icon}
      onPress={() => {
        if (userId) void followUser(userId);
      }}
      loading={isLoading}
      disabled={isLoading}
    />
  );
}
