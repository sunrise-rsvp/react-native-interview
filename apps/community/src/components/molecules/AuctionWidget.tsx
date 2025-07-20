import LogoToken from '@atoms/LogoToken';
import ProfileImg from '@atoms/ProfileImg';
import Colors from '@constants/Colors';
import useCurrentRoom from '@contexts/useCurrentRoom';
import useRoomTab, { TokenTab } from '@contexts/useRoomTab';
import useAuctionWidgetAnimation from '@hooks/useAuctionWidgetAnimation';
import { FourFinger03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useGetHighestBid } from '@queries/auctions';
import {
  Button,
  TextMonoBold,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  PinwheelIn,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';

type Props = {
  style?: ViewStyle;
};

export default function AuctionWidget({ style }: Props) {
  const { setCurrentTokenTab } = useRoomTab();
  const { isHost } = useCurrentRoom();
  const { data: highestBid, isLoading: isLoadingHighestBid } =
    useGetHighestBid();
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);
  const { animatedStyle } = useAuctionWidgetAnimation();
  const sizing = getWidgetSizing(isMobile);

  if (isLoadingHighestBid || !highestBid) return null;

  return (
    <Animated.View
      exiting={
        isMobile ? SlideOutLeft.duration(600) : SlideOutRight.duration(3000)
      }
      entering={PinwheelIn.duration(600)}
    >
      <Animated.View style={[styles.container, style, animatedStyle]}>
        <View style={styles.buttonContainer}>
          <View style={styles.topBar} />
          <Button
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
            onPress={() => {
              setCurrentTokenTab(TokenTab.BID);
            }}
            disabled={isHost}
          >
            <ProfileImg
              userId={highestBid.user_id}
              imgSize="thumbnail_large"
              styleSize={sizing.profileImgSize}
            />
          </Button>
          <View style={styles.tokenPill}>
            <LogoToken size={isMobile ? 16 : 20} />
            <TextMonoBold style={styles.tokenAmount}>
              {highestBid.amount}
            </TextMonoBold>
          </View>
        </View>

        <View style={styles.handIcon}>
          <HugeiconsIcon
            icon={FourFinger03Icon}
            color={Colors.dark.text}
            strokeWidth={2.5}
            size={sizing.handIconSize - sizing.handIconPadding}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const getWidgetSizing = (isMobile: boolean) => ({
  containerWidth: isMobile ? 62 : 80,
  containerHeight: isMobile ? 85 : 110,
  handIconSize: isMobile ? 20 : 32,
  handIconPadding: isMobile ? 6 : 8,
  topBarHeight: isMobile ? 12 : 16,
  bottomBarHeight: isMobile ? 24 : 32,
  profileImgSize: isMobile ? 40 : 50,
});

const createStyles = ({ isMobile }: WithResponsive) => {
  const sizing = getWidgetSizing(isMobile);

  return StyleSheet.create({
    container: {
      position: 'relative',
      width: sizing.containerWidth,
      height: sizing.containerHeight,
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
      height: sizing.profileImgSize,
      marginBottom: sizing.bottomBarHeight - sizing.topBarHeight,
      marginRight: 0,
    },
    buttonContent: {
      height: sizing.containerHeight,
    },
    topBar: {
      position: 'absolute',
      width: '100%',
      height: sizing.topBarHeight,
      backgroundColor: Colors.dark.purple1,
      pointerEvents: 'none',
    },
    handIcon: {
      position: 'absolute',
      top: -sizing.handIconSize / 2,
      left: 0,
      right: 0,
      marginLeft: (sizing.containerWidth - sizing.handIconSize) / 2,
      backgroundColor: Colors.dark.purple1,
      borderRadius: sizing.handIconSize / 2,
      width: sizing.handIconSize,
      height: sizing.handIconSize,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    tokenPill: {
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.dark.purple1opacity50,
      gap: isMobile ? 4 : 8,
      height: sizing.bottomBarHeight,
      borderRadius: 0,
      width: '100%',
      pointerEvents: 'none',
    },
    tokenAmount: {
      fontSize: isMobile ? 12 : 16,
      paddingTop: isMobile ? 2.4 : 3,
    },
  });
};
