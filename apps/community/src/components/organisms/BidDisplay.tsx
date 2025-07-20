import BidCircleButton from '@molecules/BidCircleButton';
import CustomBidCircleButton from '@molecules/CustomBidCircleButton';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  disabled?: boolean;
};

export default function BidDisplay({ disabled }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <BidCircleButton bidDifference={30} disabled={disabled} />
        <BidCircleButton bidDifference={20} disabled={disabled} />
      </View>
      <View style={styles.row}>
        <BidCircleButton bidDifference={10} disabled={disabled} />
        <CustomBidCircleButton disabled={disabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
});
