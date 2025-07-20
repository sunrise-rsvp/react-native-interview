import {
  assertParameterIsNotUndefinedOrNull,
  peopleApi,
  QueryKeys,
} from '@sunrise-ui/api-client';
import { useQuery } from '@tanstack/react-query';

const { relationshipStatsKey } = QueryKeys.people;

export const useGetRelationshipStats = (userId?: string) =>
  useQuery({
    async queryFn() {
      assertParameterIsNotUndefinedOrNull(userId, 'userId');
      const response =
        await peopleApi.getRelationshipStatsPeopleUserIdRelationshipStatsGet({
          userId,
        });
      return response.data;
    },
    queryKey: [relationshipStatsKey, userId],
    enabled: Boolean(userId),
  });
