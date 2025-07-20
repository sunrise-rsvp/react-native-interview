import Colors from '@constants/Colors';
import InboxItemIntro from '@molecules/InboxItemIntro';
import { useBulkGetProfiles } from '@sunrise-ui/api-client';
import { type Introduction } from '@sunrise-ui/api/network';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  intros: Introduction[];
  openIntro: (id: string) => void;
  activeIntroId?: string;
};

export default function IntroList({ intros, openIntro, activeIntroId }: Props) {
  const styles = useDynamicStyles(createStyles);

  const uniqueUserIdsToGet = [
    ...new Set(
      intros
        .map((intro) =>
          intro.introduction
            .map((iHalf) => [
              iHalf.person.user_id,
              iHalf.introduced_to.introducer_id,
            ])
            .flat(),
        )
        .flat(),
    ),
  ];
  const { isLoading } = useBulkGetProfiles(uniqueUserIdsToGet);

  if (isLoading) return null;

  return (
    <View style={styles.introListContainer}>
      <ScrollView>
        {intros.map(({ introduction }) => (
          <InboxItemIntro
            key={`message-list-item-${introduction[0].introduced_to.id}`}
            introHalves={introduction}
            activeIntroId={activeIntroId}
            openIntro={openIntro}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    introListContainer: {
      flexGrow: 1,
      maxWidth: isMobile ? '100%' : isTablet ? '49%' : '33%',
      height: '100%',
      paddingLeft: isMobile ? 12 : isTablet ? 16 : 20,
      paddingRight: isMobile ? 0 : isTablet ? 8 : 10,
      paddingVertical: isMobile ? 0 : isTablet ? 6 : 10,
      borderRadius: 30,
      backgroundColor: isMobile ? 'transparent' : Colors.dark.opacity05,
      display: 'flex',
      flexDirection: 'column',
    },
  });
