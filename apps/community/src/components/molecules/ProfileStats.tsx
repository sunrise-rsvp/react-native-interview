import React, { useCallback, useState } from 'react';

import ProfileStat from '@atoms/ProfileStat';
import { RelationshipsModalTabs } from '@hooks/useRelationshipModalData';
import RelationshipsModal from '@molecules/RelationshipsModal';
import { useGetRelationshipStats } from '@queries/people';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

type Props = {
  userId?: string;
  align?: 'vertical' | 'horizontal';
};

export default function ProfileStats({ userId, align = 'horizontal' }: Props) {
  const styles = useDynamicStyles(createStyles, { align });
  const [showRelationshipsModal, setShowRelationshipsModal] = useState(false);
  const [relationshipsModalTab, setRelationshipsModalTab] =
    useState<RelationshipsModalTabs>(RelationshipsModalTabs.CONNECTIONS);
  const { data: stats } = useGetRelationshipStats(userId);

  const openRelationshipsModal = (tab: RelationshipsModalTabs) => () => {
    if (!userId) return;

    setShowRelationshipsModal(true);
    setRelationshipsModalTab(tab);
  };

  const closeRelationshipsModal = () => {
    setShowRelationshipsModal(false);
  };

  useFocusEffect(useCallback(() => closeRelationshipsModal, [userId]));

  return (
    <View style={styles.profileStats}>
      <ProfileStat
        value={stats?.connection_count}
        label="connection"
        onPress={openRelationshipsModal(RelationshipsModalTabs.CONNECTIONS)}
      />
      <ProfileStat
        value={stats?.follower_count}
        label="follower"
        onPress={openRelationshipsModal(RelationshipsModalTabs.FOLLOWERS)}
      />
      <ProfileStat
        value={stats?.following_count}
        label="following"
        labelFormatting="none"
        onPress={openRelationshipsModal(RelationshipsModalTabs.FOLLOWING)}
      />
      {userId && (
        <RelationshipsModal
          currentTab={relationshipsModalTab}
          setCurrentTab={setRelationshipsModalTab}
          visible={showRelationshipsModal}
          hideModal={closeRelationshipsModal}
          userId={userId}
        />
      )}
    </View>
  );
}

const createStyles = ({ align }: WithResponsive<Props>) =>
  StyleSheet.create({
    profileStats: {
      display: 'flex',
      flexDirection: align === 'vertical' ? 'column' : 'row',
      gap: align === 'vertical' ? 20 : 0,
      justifyContent: 'space-between',
    },
  });
