import React, { createContext, useState, type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar as PaperSnackbar, Portal } from 'react-native-paper';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import type { WithResponsive } from '../utils/responsivity';
import { useSafeContext } from './useSafeContext';

type SnackbarType = 'error' | 'info' | 'success';

type SnackbarState = {
  text: string;
  type: SnackbarType;
  actionLabel?: string;
};

type SnackbarContextType = {
  snackbar: SnackbarState | undefined;
  showSnackbar: (snackbar: SnackbarState) => void;
  hideSnackbar: () => void;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
export const SnackbarContext = createContext<SnackbarContextType>();
SnackbarContext.displayName = 'SnackbarContext';

export const SnackbarProvider = ({ children }: PropsWithChildren) => {
  const styles = useDynamicStyles(createStyles);
  const [snackbar, setSnackbar] = useState<SnackbarState | undefined>();

  const hideSnackbar = () => {
    setSnackbar(undefined);
  };

  const showSnackbar = (newSnackbar: SnackbarState) => {
    setSnackbar(newSnackbar);
  };

  return (
    <SnackbarContext.Provider value={{ snackbar, showSnackbar, hideSnackbar }}>
      {children}
      <Portal>
        <PaperSnackbar
          style={styles.snackbar}
          visible={Boolean(snackbar)}
          onDismiss={hideSnackbar}
          action={{
            label: snackbar?.actionLabel ?? 'Ok',
            onPress: hideSnackbar,
          }}
          duration={3500}
        >
          {snackbar?.text}
        </PaperSnackbar>
      </Portal>
    </SnackbarContext.Provider>
  );
};

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    snackbar: {
      margin: isMobile ? 12 : isTablet ? 16 : 20,
      borderRadius: isMobile ? 16 : 30,
      width: isMobile ? undefined : isTablet ? '50%' : '30%',
    },
  });

export const useSnackbar = () => {
  return useSafeContext(SnackbarContext);
};
