import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  type DimensionValue,
} from 'react-native';

import Colors from '@constants/Colors';
import useBlockedUsers from '@contexts/useBlockedUsers';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import ProfileResult from '@molecules/ProfileResult';
import { useSearchProfiles } from '@sunrise-ui/api-client';
import { type Profile } from '@sunrise-ui/api/profile';
import {
  Loader,
  TextInput,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { TextInput as PaperTextInput } from 'react-native-paper';

type Props = {
  onSelect: (profile: Profile) => void | Promise<void>;
  width?: DimensionValue;
  maxHeight?: number;
  hiddenIds?: string[];
  searchType?: 'connections' | 'users';
};

export default function PersonSearch({
  onSelect,
  width,
  maxHeight,
  hiddenIds,
}: Props) {
  const { isLoading: isLoadingBlockedUsers, isUserBlocked } = useBlockedUsers();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const styles = useDynamicStyles(createStyles, { search, width, maxHeight });
  const isDebouncing = search !== debouncedSearch;

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isRefetching,
  } = useSearchProfiles(debouncedSearch);

  const profiles = data?.pages.flatMap((page) => page?.results ?? []);

  const results = profiles?.filter(
    (profile) =>
      !hiddenIds?.includes(profile.user_id) && !isUserBlocked(profile.user_id),
  );

  const hasRelevantData =
    !isLoadingBlockedUsers &&
    data &&
    data?.pages[0]?.searchQuery.slice(0, 3) === search.slice(0, 3);

  return (
    <View style={styles.container}>
      <TextInput
        label="Search for someone..."
        value={search}
        onChange={setSearch}
        style={styles.searchInput}
        autoCorrect={false}
        left={
          <PaperTextInput.Icon
            icon={() => (
              <HugeiconsIcon icon={Search01Icon} color={Colors.dark.text} />
            )}
            loading={
              hasRelevantData &&
              (search.length > 3 || debouncedSearch.length > 3) &&
              (isDebouncing || isRefetching)
            }
          />
        }
      />
      <FlatList
        data={hasRelevantData ? results : []}
        bounces={false}
        renderItem={({ item: profile }) => (
          <TouchableOpacity
            key={profile.user_id}
            style={styles.listItem}
            onPress={async () => {
              await onSelect(profile);
            }}
          >
            <ProfileResult userId={profile.user_id} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.user_id}
        onEndReached={async () => {
          if (hasNextPage && !isFetching) {
            await fetchNextPage();
          }
        }}
        windowSize={4}
        initialNumToRender={5}
        ListFooterComponent={isFetchingNextPage ? <Loader /> : null}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={
          search ? (
            <View style={styles.emptyListItem}>
              {search.length > 2 ? (
                hasRelevantData ? (
                  <TextReg>No results found</TextReg>
                ) : (
                  <Loader />
                )
              ) : (
                <TextReg>Please enter 3 or more characters to search</TextReg>
              )}
            </View>
          ) : null
        }
      />
    </View>
  );
}

const createStyles = ({
  isMobile,
  isTablet,
  maxHeight,
  search,
}: WithResponsive<Props & { search: string }>) => {
  const borderRadius = 30;
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      flexShrink: 1,
    },
    searchInput: {
      backgroundColor: Colors.dark.opacity05,
      borderTopRightRadius: borderRadius,
      borderTopLeftRadius: borderRadius,
      borderBottomRightRadius: search ? 0 : borderRadius,
      borderBottomLeftRadius: search ? 0 : borderRadius,
    },
    list: {
      borderBottomRightRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
    },
    listContent: {
      backgroundColor: Colors.dark.opacity05,
      paddingHorizontal: isMobile ? 12 : 24,
      borderBottomRightRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      maxHeight: maxHeight,
    },
    listItem: {
      display: 'flex',
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      marginBottom: 20,
    },
    emptyListItem: {
      paddingVertical: isMobile ? 12 : isTablet ? 16 : 20,
    },
  });
};
