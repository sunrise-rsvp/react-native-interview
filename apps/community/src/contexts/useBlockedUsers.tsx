import { useGetBlockedUsersProfiles } from '@sunrise-ui/api-client';
import { useSafeContext } from '@sunrise-ui/primitives';
import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

export type BlockedUsersContextType = {
  blockedUserIds: Set<string>;
  isLoading: boolean;
  isUserBlocked: (userId: string) => boolean;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const BlockedUsersContext = createContext<BlockedUsersContextType>();
BlockedUsersContext.displayName = 'BlockedUsersContext';

export const BlockedUsersProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    data,
    isLoading: isLoadingBlockedUsers,
    hasNextPage,
    fetchNextPage,
  } = useGetBlockedUsersProfiles();

  const fetchAllBlockedUsers = async () => {
    try {
      let keepFetching = true;
      while (keepFetching) {
        const result = await fetchNextPage();
        keepFetching = result.hasNextPage;
      }
    } catch (err) {
      console.error('Error fetching all blocked users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoadingBlockedUsers) return;

    if (hasNextPage) {
      void fetchAllBlockedUsers();
    } else {
      setIsLoading(false);
    }
  }, [isLoadingBlockedUsers, hasNextPage]);

  const blockedUserIds = useMemo(() => {
    if (!data || isLoading) return new Set<string>();

    const ids = new Set<string>();
    data.pages.forEach((page) => {
      page.results?.forEach((blockedUser) => {
        ids.add(blockedUser.blocked_user_id);
      });
    });
    return ids;
  }, [data, isLoading]);

  const isUserBlocked = (userId: string): boolean => {
    return blockedUserIds.has(userId);
  };

  return (
    <BlockedUsersContext.Provider
      value={{
        blockedUserIds,
        isLoading,
        isUserBlocked,
      }}
    >
      {children}
    </BlockedUsersContext.Provider>
  );
};

export default function useBlockedUsers() {
  return useSafeContext(BlockedUsersContext);
}
