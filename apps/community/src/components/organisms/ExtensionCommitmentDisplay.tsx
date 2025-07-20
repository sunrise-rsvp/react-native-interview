import CustomExtensionCircleButton from '@molecules/CustomExtensionCircleButton';
import ExtensionCircleButton from '@molecules/ExtensionCircleButton';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ExtensionCommitmentDisplay() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ExtensionCircleButton />
        <ExtensionCircleButton factor={2} />
      </View>
      <View style={styles.row}>
        <ExtensionCircleButton factor={4} />
        <CustomExtensionCircleButton />
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
