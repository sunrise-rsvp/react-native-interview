import LogoToken from '@atoms/LogoToken';
import Colors from '@constants/Colors';
import useRoomTab, { TokenTab } from '@contexts/useRoomTab';
import useExtensionProgressBarAnimations from '@hooks/useExtensionProgressBarAnimations';
import useExtensionWidgetAnimation from '@hooks/useExtensionWidgetAnimation';
import useGetExtensionInfo from '@hooks/useGetExtensionInfo';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Button,
  TextMono,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  style?: ViewStyle;
};

export default function ExtensionWidget({ style }: Props) {
  const { setCurrentTokenTab } = useRoomTab();
  const {
    totalPrice = 1,
    currentCommitment = 0,
    isLoading,
    isExtensionOpen,
  } = useGetExtensionInfo();
  const progress = currentCommitment / totalPrice;
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles, { progress });
  const sizing = getWidgetSizing(isMobile);
  const { animatedWidthStyle } = useExtensionProgressBarAnimations({
    startingWidth: isMobile ? 6 : 8,
    containerWidth: sizing.containerSize,
  });
  const { animatedStyle } = useExtensionWidgetAnimation();

  if (isLoading || !isExtensionOpen) return null;

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      <View style={styles.buttonContainer}>
        <View style={styles.topBar} />
        <Animated.View style={[styles.progressBar, animatedWidthStyle]}>
          <LinearGradient
            colors={[Colors.dark.purple1, Colors.dark.purple0]}
            locations={[0, 0.9]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.progressGradient}
          />
        </Animated.View>

        <Button
          style={styles.button}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.buttonContent}
          onPress={() => {
            setCurrentTokenTab(TokenTab.EXTEND);
          }}
        >
          <TextMono style={styles.clockText}>+1:00</TextMono>
        </Button>
      </View>

      <View style={styles.clockIcon}>
        <HugeiconsIcon
          icon={Clock01Icon}
          color={Colors.dark.text}
          strokeWidth={2.5}
          size={sizing.clockIconSize - sizing.clockIconPadding}
        />
      </View>
      <Animated.View style={[styles.progressIconContainer, animatedWidthStyle]}>
        <View style={styles.progressIcon}>
          <LogoToken size={sizing.progressIconSize} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const getWidgetSizing = (isMobile: boolean) => ({
  containerSize: isMobile ? 62 : 80,
  clockIconSize: isMobile ? 20 : 32,
  clockIconPadding: isMobile ? 8 : 12,
  progressIconSize: isMobile ? 16 : 22,
  barHeight: isMobile ? 12 : 16,
  progressIconBottom: isMobile ? 15 : 20,
});

const createStyles = ({ isMobile }: WithResponsive<{ progress: number }>) => {
  const sizing = getWidgetSizing(isMobile);

  return StyleSheet.create({
    container: {
      position: 'relative',
      width: sizing.containerSize,
      height: sizing.containerSize,
    },
    buttonContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 10,
      backgroundColor: Colors.dark.purple1opacity50,
    },
    button: {
      minWidth: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
    },
    buttonLabel: {
      marginTop: 0,
      marginLeft: 0,
      marginBottom: 0,
      marginRight: 0,
    },
    buttonContent: {
      height: sizing.containerSize,
    },
    topBar: {
      position: 'absolute',
      width: '100%',
      height: sizing.barHeight,
      backgroundColor: Colors.dark.purple1,
      pointerEvents: 'none',
    },
    clockIcon: {
      position: 'absolute',
      top: -sizing.clockIconSize / 2,
      left: 0,
      right: 0,
      marginLeft: (sizing.containerSize - sizing.clockIconSize) / 2,
      backgroundColor: Colors.dark.purple1,
      borderRadius: sizing.clockIconSize / 2,
      width: sizing.clockIconSize,
      height: sizing.clockIconSize,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    progressBar: {
      position: 'absolute',
      height: sizing.barHeight,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
    },
    progressGradient: {
      width: '100%',
      height: sizing.barHeight,
    },
    progressIconContainer: {
      pointerEvents: 'none',
      position: 'absolute',
      height: 0,
      bottom: sizing.progressIconBottom,
    },
    progressIcon: {
      width: sizing.progressIconSize,
      height: sizing.progressIconSize,
      position: 'absolute',
      right: -2,
    },
    clockText: {
      fontSize: isMobile ? 16 : 22,
    },
  });
};
