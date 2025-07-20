import { Cancel01Icon } from '@hugeicons/core-free-icons';
import React, {
  createContext,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Banner as PaperBanner } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '../components/IconButton';
import { TextReg } from '../components/StyledText';
import { Colors } from '../constants/Colors';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import type { WithResponsive } from '../utils/responsivity';
import { useSafeContext } from './useSafeContext';

type BannerType = 'error' | 'info' | 'success';

type BannerState = {
  text: string;
  type: BannerType;
  autoDismiss?: boolean;
};

type BannerContextType = {
  banner: BannerState | undefined;
  showBanner: (banner: BannerState) => void;
  hideBanner: () => void;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
export const BannerContext = createContext<BannerContextType>();
BannerContext.displayName = 'BannerContext';

type Props = {
  children: ReactNode;
};

export const BannerProvider = ({ children }: Props) => {
  const [banner, setBanner] = useState<BannerState | undefined>();
  const styles = useDynamicStyles(createStyles);

  const hideBanner = useCallback(() => {
    setBanner(undefined);
  }, []);

  const showBanner = useCallback((newBanner: BannerState) => {
    setBanner(newBanner);
    if (newBanner.autoDismiss) setTimeout(hideBanner, 3500);
  }, []);

  return (
    <BannerContext.Provider value={{ banner, showBanner, hideBanner }}>
      <PaperBanner style={styles.banner} visible={Boolean(banner)}>
        <SafeAreaView edges={['top']} style={{ width: '100%' }}>
          <View style={styles.bannerContent}>
            <TextReg style={styles.text}>{banner?.text}</TextReg>
            <IconButton icon={Cancel01Icon} onPress={hideBanner} />
          </View>
        </SafeAreaView>
      </PaperBanner>
      {children}
    </BannerContext.Provider>
  );
};

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    banner: {
      backgroundColor: Colors.purple1,
      width: '100%',
    },
    bannerContent: {
      gap: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 8,
    },
    text: {
      fontSize: isMobile ? 14 : 18,
      flex: 1,
      display: 'flex',
    },
  });

export const useBanner = () => {
  return useSafeContext(BannerContext);
};
