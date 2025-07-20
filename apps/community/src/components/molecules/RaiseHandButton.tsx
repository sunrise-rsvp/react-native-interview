import Colors from '@constants/Colors';
import useRoomTab, { TokenTab } from '@contexts/useRoomTab';
import useRaiseHandButtonAnimation from '@hooks/useRaiseHandButtonAnimation';
import { FourFinger03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useGetHighestBid } from '@queries/auctions';
import {
  Button,
  ButtonVariants,
  useDynamicStyles,
  useMediaQueries,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

export default function RaiseHandButton() {
  const { isMobile } = useMediaQueries();
  const { setCurrentTokenTab } = useRoomTab();
  const { currentUserId } = useUserAuth();
  const styles = useDynamicStyles(createStyles);
  const { data: highestBid } = useGetHighestBid();
  const highestBidder = highestBid?.user_id;
  const { animatedStyle } = useRaiseHandButtonAnimation();

  return (
    <Animated.View style={[styles.animatedContainer, animatedStyle]}>
      <Button
        onPress={() => {
          setCurrentTokenTab(TokenTab.BID);
        }}
        style={styles.button}
        contentStyle={styles.button}
        labelStyle={styles.buttonLabel}
        variant={
          highestBidder === currentUserId
            ? ButtonVariants.PURPLE
            : isMobile
              ? ButtonVariants.CLEAR
              : ButtonVariants.DARK_50
        }
      >
        <HugeiconsIcon
          icon={FourFinger03Icon}
          size={isMobile ? undefined : 50}
          color={Colors.dark.text}
          strokeWidth={isMobile ? undefined : 1}
        />
      </Button>
    </Animated.View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    animatedContainer: {
      borderRadius: isMobile ? 22 : 40,
    },
    button: {
      width: isMobile ? 44 : 80,
      height: isMobile ? 44 : 80,
      borderRadius: isMobile ? 22 : 40,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonLabel: {
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
    },
  });
