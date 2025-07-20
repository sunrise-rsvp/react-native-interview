import Colors from '@constants/Colors';
import {
  Button,
  ButtonVariants,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog as PaperDialog, Portal } from 'react-native-paper';

type Props = {
  visible: boolean;
  hide: () => void;
  title?: string;
  content: string;
  primaryText: string;
  primaryOnPress: () => void;
  secondaryText?: string;
  secondaryOnPress?: () => void;
};

export default function Dialog({
  visible,
  hide,
  title,
  content,
  primaryText,
  primaryOnPress,
  secondaryText,
  secondaryOnPress,
}: Props) {
  const styles = useDynamicStyles(createStyles);

  return (
    <Portal>
      <PaperDialog visible={visible} onDismiss={hide} style={styles.dialog}>
        {title && <PaperDialog.Title>{title}</PaperDialog.Title>}
        <PaperDialog.Content>
          <TextReg>{content}</TextReg>
        </PaperDialog.Content>
        <PaperDialog.Actions style={styles.buttons}>
          {secondaryText && secondaryOnPress && (
            <Button variant={ButtonVariants.CLEAR} onPress={secondaryOnPress}>
              {secondaryText}
            </Button>
          )}
          <Button onPress={primaryOnPress}>{primaryText}</Button>
        </PaperDialog.Actions>
      </PaperDialog>
    </Portal>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    dialog: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: isMobile ? '90%' : isTablet ? '50%' : '30%',
      backgroundColor: Colors.dark.purple0,
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
    },
  });
