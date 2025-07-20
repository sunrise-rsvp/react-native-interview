import React, { useState } from 'react';
import type { FlatListProps } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import type { WithResponsive } from '../utils/responsivity';
import { Loader } from './Loader';
import { TextBold } from './StyledText';

export type BaseCardsListProps<TCard> = {
  isLoading: boolean;
  emptyStateText?: string;
  onRefresh: () => Promise<void>;
} & Omit<FlatListProps<TCard>, 'onRefresh'>;

export function BaseCardsList<TCard>({
  isLoading,
  emptyStateText,
  onRefresh,
  ...otherProps
}: BaseCardsListProps<TCard>) {
  const styles = useDynamicStyles(createStyles);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setIsRefreshing(false);
  };

  return (
    <FlatList
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      ListEmptyComponent={
        isLoading ? (
          <Loader />
        ) : (
          <TextBold style={styles.emptyStateText}>{emptyStateText}</TextBold>
        )
      }
      style={styles.list}
      windowSize={4}
      initialNumToRender={5}
      {...otherProps}
    />
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    list: {
      maxWidth: '100%',
    },
    emptyStateText: {
      padding: 12,
      fontSize: isMobile ? 14 : 16,
    },
  });
