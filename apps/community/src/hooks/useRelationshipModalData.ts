import { useGetConnections } from '@queries/connections';
import { useGetFollowers, useGetFollowing } from '@queries/follows';

export enum RelationshipsModalTabs {
  CONNECTIONS = 'connections',
  FOLLOWERS = 'followers',
  FOLLOWING = 'following',
}

type Props = {
  userId: string;
  tab?: RelationshipsModalTabs;
};
export default function useRelationshipModalData({ userId, tab }: Props) {
  const { isLoading: isLoadingConnections, data: connections } =
    useGetConnections({ userId });
  const { isLoading: isLoadingFollowing, data: following } = useGetFollowing();
  const { isLoading: isLoadingFollowers, data: followers } = useGetFollowers({
    userId,
  });

  switch (tab) {
    case RelationshipsModalTabs.CONNECTIONS:
      return { isLoading: isLoadingConnections, persons: connections };
    case RelationshipsModalTabs.FOLLOWERS:
      return { isLoading: isLoadingFollowers, persons: followers };
    case RelationshipsModalTabs.FOLLOWING:
      return { isLoading: isLoadingFollowing, persons: following };
    default:
      return { isLoading: false };
  }
}
