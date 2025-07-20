import { type Profile } from '@sunrise-ui/api/profile';
import { type QueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../constants/QueryKeys';
import { profilesApi } from './api';

const { profileKey } = QueryKeys.profiles;

export const bulkGetProfiles = async (
  queryClient: QueryClient,
  userIds: string[] = [],
) => {
  const idsToGet = userIds.filter(
    (id) => !queryClient.getQueryData([profileKey, id]),
  );

  if (idsToGet.length === 0) {
    return userIds.map(
      (id) => queryClient.getQueryData<Profile>([profileKey, id])!,
    );
  }

  const response = await profilesApi.bulkGetProfileProfilesUsersBulkPost({
    bulkGetProfilesInput: {
      user_ids: idsToGet,
    },
  });

  response.data.forEach((profile) => {
    queryClient.setQueryData([profileKey, profile.user_id], profile);
  });

  return userIds
    .map((id) => queryClient.getQueryData<Profile>([profileKey, id]))
    .filter((profile, index) => {
      if (profile) return true;

      console.warn(`Missing profile info for ${userIds[index]}`);
      return false;
    }) as Profile[];
};
