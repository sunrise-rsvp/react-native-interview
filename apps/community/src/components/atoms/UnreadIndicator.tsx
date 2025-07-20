import Colors from '@constants/Colors';
import { TextBold } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  count?: number;
};

export default function UnreadIndicator({ count }: Props) {
  if (!count || count === 0) return null;

  return (
    <View style={styles.circle}>
      <TextBold style={styles.count}>{count}</TextBold>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.dark.yellow0,
    paddingHorizontal: 4,
    borderRadius: 15,
    width: 15,
    height: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 10,
    color: Colors.dark.black,
    textAlign: 'center',
  },
});
