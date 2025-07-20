import useBlockedUsers from '@contexts/useBlockedUsers';
import {
  QueryKeys,
  assertParameterIsNotEmptyString,
  assertParameterIsNotUndefinedOrNull,
  connectionsApi,
} from '@sunrise-ui/api-client';
import { type ConnectionsApiGetConnectionsConnectionsUserIdGetRequest } from '@sunrise-ui/api/network';
import { useUserAuth } from '@sunrise-ui/primitives';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const { myConnectionsKey, isConnectedKey } = QueryKeys.connections;

export const useGetConnections = ({
  userId,
  enabled = true,
}: ConnectionsApiGetConnectionsConnectionsUserIdGetRequest & {
  enabled?: boolean;
}) => {
  const { isLoading: isLoadingBlockedUsers, isUserBlocked } = useBlockedUsers();

  const {
    isLoading: isLoadingConnections,
    data,
    ...otherProps
  } = useQuery({
    async queryFn() {
      const response = await connectionsApi.getConnectionsConnectionsUserIdGet({
        userId,
      });
      return response.data;
    },
    queryKey: [myConnectionsKey, userId],
    enabled: Boolean(userId) && enabled && !isLoadingBlockedUsers,
  });

  const filteredData = useMemo(
    () => data?.filter((user) => !isUserBlocked(user.user_id)),
    [data, isUserBlocked],
  );

  return {
    isLoading: isLoadingConnections || isLoadingBlockedUsers,
    data: filteredData,
    ...otherProps,
  };
};

export const useIsConnected = ({ userId }: { userId?: string }) => {
  const { currentUserId } = useUserAuth();
  return useQuery({
    async queryFn() {
      assertParameterIsNotEmptyString(userId, 'userId');
      assertParameterIsNotUndefinedOrNull(userId, 'userId');

      const response =
        await connectionsApi.isConnectedWithConnectionsIsConnectedGet({
          user1Id: currentUserId,
          user2Id: userId,
        });
      return response.data.is_connected;
    },
    queryKey: [isConnectedKey, userId],
    enabled: Boolean(userId),
  });
};

export const useGetIsConnected = () => {
  const { currentUserId } = useUserAuth();
  return useMutation({
    async mutationFn({ userId }: { userId: string }) {
      const response =
        await connectionsApi.isConnectedWithConnectionsIsConnectedGet({
          user1Id: currentUserId,
          user2Id: userId,
        });
      return response.data.is_connected;
    },
  });
};
