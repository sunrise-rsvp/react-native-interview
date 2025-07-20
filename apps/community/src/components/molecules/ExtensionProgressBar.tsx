import LogoToken from '@atoms/LogoToken';
import Colors from '@constants/Colors';
import useExtensionProgressBarAnimations from '@hooks/useExtensionProgressBarAnimations';
import useGetExtensionInfo from '@hooks/useGetExtensionInfo';
import {
  TextBold,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

const ICON_SIZE = 50;
const ICON_OVERHANG = 6;
const STARTING_PROGRESS_WIDTH = ICON_SIZE / 2 - ICON_OVERHANG; // Midpoint of the icon is the progress

export default function ExtensionProgressBar() {
  const {
    totalPrice = 1,
    currentCommitment = 0,
    isExtensionOpen,
  } = useGetExtensionInfo();
  const progress = currentCommitment / totalPrice;
  const [containerWidth, setContainerWidth] = useState(1);
  const styles = useDynamicStyles(createStyles);
  const { animatedWidthStyle, animatedTextLeftStyle, animatedTextRightStyle } =
    useExtensionProgressBarAnimations({
      startingWidth: STARTING_PROGRESS_WIDTH,
      containerWidth,
    });

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <View style={styles.progressBarBackground} />
      <Animated.View
        style={[styles.progressBarForeground, animatedWidthStyle]}
      />
      <Animated.View style={[styles.progressIconContainer, animatedWidthStyle]}>
        <LinearGradient
          colors={[Colors.dark.purple1, Colors.dark.purple0]}
          locations={[0.2, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.progressGradient}
        />
        <View style={styles.progressIcon}>
          <LogoToken size={ICON_SIZE} />
        </View>
      </Animated.View>
      {isExtensionOpen && (
        <View style={[styles.progressTextContainer]}>
          <Animated.View
            style={[
              animatedWidthStyle,
              animatedTextLeftStyle,
              styles.progressTextLeftContainer,
            ]}
          >
            {progress > 0.5 && (
              <TextBold style={styles.progressTextLeft}>
                {currentCommitment} of {totalPrice}
              </TextBold>
            )}
          </Animated.View>
          <Animated.View style={animatedTextRightStyle}>
            {progress <= 0.5 && (
              <TextBold style={styles.progressTextRight}>
                {currentCommitment} of {totalPrice}
              </TextBold>
            )}
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
    },
    progressIconContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignSelf: 'flex-start',
      alignItems: 'center',
      position: 'absolute',
      minWidth: 2 * STARTING_PROGRESS_WIDTH,
    },
    progressGradient: {
      top: 3,
      width: '100%',
      height: 44,
      maxWidth: 100,
      borderRadius: 22,
      position: 'absolute',
    },
    progressBarBackground: {
      marginVertical: 3,
      width: '100%',
      borderRadius: 22,
      height: 44,
      backgroundColor: Colors.dark.purple1opacity50,
    },
    progressBarForeground: {
      position: 'absolute',
      marginVertical: 3,
      borderRadius: 22,
      height: 44,
      backgroundColor: Colors.dark.purple1,
      minWidth: 2 * STARTING_PROGRESS_WIDTH,
    },
    progressIcon: {
      position: 'absolute',
      top: 0,
      right: -ICON_OVERHANG,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressTextContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressTextLeftContainer: {
      alignItems: 'flex-end',
    },
    progressTextLeft: {
      fontSize: isMobile ? 14 : 16,
      paddingRight: 56,
    },
    progressTextRight: {
      fontSize: isMobile ? 14 : 16,
      paddingLeft: 18,
    },
  });
