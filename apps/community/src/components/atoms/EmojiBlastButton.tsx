import { TextReg, isNative, useDynamicStyles } from '@sunrise-ui/primitives';
import { emojiBlast } from 'emoji-blast';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton as PaperIconButton } from 'react-native-paper';

type Props = {
  emoji: string;
};

export default function EmojiBlastButton({ emoji }: Props) {
  const styles = useDynamicStyles(createStyles);

  if (isNative) return null;

  return (
    <PaperIconButton
      onPress={() => {
        emojiBlast({
          emojis: [emoji],
          emojiCount: () => Math.random() * 10 + 10,
        });
      }}
      icon={() => <TextReg style={styles.emoji}>{emoji}</TextReg>}
      size={24}
      style={styles.button}
    />
  );
}

const createStyles = () =>
  StyleSheet.create({
    emoji: {
      fontSize: 20,
    },
    button: {
      margin: 0,
      backgroundColor: 'transparent',
      width: 44,
      height: 44,
      borderRadius: 22,
    },
  });
