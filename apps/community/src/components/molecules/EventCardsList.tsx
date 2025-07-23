import type { PropsWithChildren } from 'react';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import InPersonEventCard from '@molecules/InPersonEventCard';
import { ExperienceType, type Event } from '@sunrise-ui/api/events';
import type { BaseCardsListProps } from '@sunrise-ui/primitives';
import {
  BaseCardsList,
  useDynamicStyles,
  useMediaQueries,
} from '@sunrise-ui/primitives';
import { DateTime } from 'luxon';

type Props = Omit<
  BaseCardsListProps<Event>,
  'renderItem' | 'keyExtractor' | 'data'
> & {
  events?: Event[];
  cardStyle?: ViewStyle;
};

export default function EventCardsList({
  events,
  cardStyle,
  ...otherProps
}: Props) {
  const { isMobile } = useMediaQueries();
  const numColumns = isMobile ? 1 : 2;

  return (
    <BaseCardsList<Event>
      data={events}
      numColumns={numColumns}
      key={numColumns}
      renderItem={({ item: event }) => {
        if (event.experience_type === ExperienceType.InPerson) {
          return (
            <MobileCardWrapper>
              <InPersonEventCard
                style={cardStyle}
                title={event.name}
                description={event.description}
                startDate={DateTime.fromISO(event.start_date!)}
              />
            </MobileCardWrapper>
          );
        } else {
          return null;
        }
      }}
      keyExtractor={(item) => item.id!}
      columnWrapperStyle={
        numColumns !== 1 ? { justifyContent: 'center' } : undefined
      }
      {...otherProps}
    />
  );
}

const MobileCardWrapper = ({ children }: PropsWithChildren) => {
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);

  if (!isMobile) return children;

  if (isMobile) return <View style={styles.wrapper}>{children}</View>;
};

const createStyles = () =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
