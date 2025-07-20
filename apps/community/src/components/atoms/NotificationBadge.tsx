import Colors from '@constants/Colors';
import {
  TextMono,
  isAndroid,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  text?: string;
  rightPosition?: number;
};

export default function NotificationBadge({
  text,
  rightPosition = 20,
  children,
}: PropsWithChildren<Props>) {
  const styles = useDynamicStyles(createStyles, { rightPosition });
  return (
    <View style={styles.container}>
      {children}
      {text && (
        <View style={styles.textContainer}>
          <TextMono style={styles.text}>{text}</TextMono>
        </View>
      )}
    </View>
  );
}

const createStyles = ({ rightPosition }: WithResponsive<Props>) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    textContainer: {
      position: 'absolute',
      paddingHorizontal: 8,
      right: rightPosition,
      backgroundColor: Colors.dark.purple1opacity50,
      borderRadius: 10,
      overflow: 'hidden',
      justifyContent: 'center',
      height: 24,
    },
    text: {
      width: '100%',
      fontSize: 14,
      marginTop: isAndroid ? -2 : 2,
    },
  });
