import Colors from '@constants/Colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Button, useDynamicStyles } from '@sunrise-ui/primitives';
import React, { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';

type Props = {
  done: boolean;
  onPress: () => void;
  children: ReactNode;
};

export default function TodoButton({ done, onPress, children }: Props) {
  const styles = useDynamicStyles(createStyles, { done });

  return (
    <Button
      onPress={onPress}
      style={styles.button}
      contentStyle={styles.buttonContent}
      labelStyle={styles.buttonLabel}
      icon={() => (
        <HugeiconsIcon
          icon={Icon}
          size={16}
          source="circle"
          color={done ? Colors.dark.green0 : Colors.dark.opacity20}
        />
      )}
    >
      {children}
    </Button>
  );
}

const createStyles = () =>
  StyleSheet.create({
    button: {
      width: '100%',
    },
    buttonContent: {
      gap: 26,
    },
    buttonLabel: {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
  });
