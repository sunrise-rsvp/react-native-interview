import { useUserAuth } from '@sunrise-ui/primitives';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../constants/QueryKeys';
import { adminProfilesApi } from '../utils/api';

const { allUsersKey, adminProfileKey } = QueryKeys.admin;

export const useGetAllUsers = (enabled: boolean) =>
  useQuery({
    queryFn: async () =>
      adminProfilesApi.listUsersProfilesGet().then((response) => response.data),
    queryKey: [allUsersKey],
    enabled,
  });

export const useUserAdminProfile = () => {
  const { currentUserId } = useUserAuth();

  return useQuery({
    queryFn: async () => {
      const response = await adminProfilesApi.getUserByIdProfilesUserIdGet({
        userId: currentUserId,
      });
      return response.data;
    },
    queryKey: [adminProfileKey],
    staleTime: 30000,
  });
};
