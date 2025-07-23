import React from 'react';

import ProfileStat from '@atoms/ProfileStat';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';
import { StyleSheet, View } from 'react-native';

type Props = {
  align?: 'vertical' | 'horizontal';
};

export default function ProfileStats({ align = 'horizontal' }: Props) {
  const styles = useDynamicStyles(createStyles, { align });

  return (
    <View style={styles.profileStats}>
      <ProfileStat
        value={3}
        label="connection"
      />
      <ProfileStat
        value={120}
        label="follower"
      />
      <ProfileStat
        value={25}
        label="following"
        labelFormatting="none"
      />
    </View>
  );
}

const createStyles = ({ align }: WithResponsive<Props>) =>
  StyleSheet.create({
    profileStats: {
      display: 'flex',
      flexDirection: align === 'vertical' ? 'column' : 'row',
      gap: align === 'vertical' ? 20 : 0,
      justifyContent: 'space-between'
    }
  });
