import EmojiBlastButton from '@atoms/EmojiBlastButton';
import Colors from '@constants/Colors';
import { useDynamicStyles } from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function EmojiBlastDisplay() {
  const styles = useDynamicStyles(createStyles);
  return (
    <View style={styles.container}>
      <EmojiBlastButton emoji="&#x1F389;" />
      <EmojiBlastButton emoji="&#x1F602;" />
      <EmojiBlastButton emoji="&#x1F525;" />
      <EmojiBlastButton emoji="&#x1FAE0;" />
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 100,
      fontSize: 20,
      backgroundColor: Colors.dark.inputGrey,
    },
  });
