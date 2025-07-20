import Colors from '@constants/Colors';
import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import { UserSwitchIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  useGetCurrentAuctionRound,
  useSelectHighestBidder,
} from '@queries/auctions';
import { useGetRoom } from '@queries/rooms';
import {
  Button,
  ButtonVariants,
  Loader,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function BringToStageButton() {
  const styles = useDynamicStyles(createStyles);
  const { isMobile } = useMediaQueries();
  const { mutateAsync: selectHighestBidder, isPending: isPendingAuction } =
    useSelectHighestBidder();
  const { currentRoomId } = useCurrentEventInfo();
  const { data: round } = useGetCurrentAuctionRound();
  const { data: room } = useGetRoom(currentRoomId);

  const handleBringToStage = async () => {
    if (round && room)
      await selectHighestBidder({
        userId: room.user_id,
        roundId: round.round_id,
      });
  };

  return (
    <Button
      onPress={handleBringToStage}
      style={styles.button}
      contentStyle={styles.button}
      labelStyle={styles.buttonLabel}
      variant={ButtonVariants.DARK_50}
      disabled={isPendingAuction}
    >
      {isPendingAuction ? (
        <Loader />
      ) : (
        <HugeiconsIcon
          icon={UserSwitchIcon}
          size={isMobile ? undefined : 50}
          color={Colors.dark.text}
          strokeWidth={isMobile ? undefined : 1}
        />
      )}
    </Button>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
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
