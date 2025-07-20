import React, { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Modal as PaperModal, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import type { WithResponsive } from '../utils/responsivity';
import { useMediaQueries } from '../utils/responsivity';

type Props = {
  visible: boolean;
  hide: () => void;
  children: ReactNode;
  fullscreenOnBreakpoint?: boolean;
  modalStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  header?: ReactNode;
  breakpoint?: 'mobile' | 'tablet';
};

export function Modal({
  visible,
  hide,
  children,
  fullscreenOnBreakpoint = true,
  modalStyle,
  contentStyle,
  header,
  breakpoint = 'mobile',
}: Props) {
  const insets = useSafeAreaInsets();
  const { isMobile, isTablet } = useMediaQueries();
  const isBreakpoint = isMobile || (breakpoint === 'tablet' && isTablet);
  const styles = useDynamicStyles(createStyles, {
    fullscreenOnBreakpoint,
    isBreakpoint,
    insetTop: header ? 0 : insets.top,
  });

  return (
    <Portal>
      <PaperModal
        visible={visible}
        onDismiss={hide}
        contentContainerStyle={[styles.modalContent, modalStyle]}
        style={styles.modal}
      >
        {header}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </PaperModal>
    </Portal>
  );
}

const createStyles = ({
  fullscreenOnBreakpoint,
  isBreakpoint,
  insetTop,
}: WithResponsive<Props & { isBreakpoint: boolean; insetTop: number }>) =>
  StyleSheet.create({
    modal: {
      marginTop: 0,
      marginBottom: 0,
    },
    modalContent: {
      width: isBreakpoint ? (fullscreenOnBreakpoint ? '100%' : '80%') : '80%',
      height: isBreakpoint ? '100%' : 766,
      maxHeight: '100%',
      borderRadius: isBreakpoint ? 0 : 30,
      maxWidth: 900,
      backgroundColor: Colors.purple0,
      marginLeft: fullscreenOnBreakpoint ? 'auto' : 0,
      marginRight: 'auto',
      overflow: isBreakpoint ? 'visible' : 'hidden',
      shadowOpacity: 0,
      paddingTop: insetTop,
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      padding: isBreakpoint ? (fullscreenOnBreakpoint ? 15 : 12) : 32,
      flex: 1,
    },
  });
