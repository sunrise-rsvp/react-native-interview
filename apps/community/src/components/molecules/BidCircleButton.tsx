import useBidHistory from '@contexts/useBidHistory';
import RaiseHandModal from '@molecules/RaiseHandModal';
import TokenCircleButton from '@molecules/TokenCircleButton';
import {
  useGetCurrentAuctionRound,
  useGetHighestBid,
  usePlaceBid,
} from '@queries/auctions';
import { useGetUserTokens } from '@queries/tokens';
import React, { useState } from 'react';

type Props = {
  bidDifference: number;
  disabled?: boolean;
};

export default function BidCircleButton({ bidDifference, disabled }: Props) {
  const { hasPreviouslyBid } = useBidHistory();
  const { data: tokens, isLoading: isLoadingTokens } = useGetUserTokens();
  const { data: highestBid, isLoading: isLoadingHighestBid } =
    useGetHighestBid();
  const { data: round, isLoading: isLoadingRound } =
    useGetCurrentAuctionRound();
  const { mutateAsync: placeBid, isPending: isPlacingBid } = usePlaceBid();
  const [showModal, setShowModal] = useState(false);

  const amount = (highestBid?.amount ?? 0) + bidDifference;
  const canAfford = !highestBid || (tokens?.count ?? 0) >= amount;
  const isLoading =
    isLoadingHighestBid || isLoadingTokens || isLoadingRound || !round;
  const placeBidInRound = async () => {
    if (round)
      await placeBid({
        roundId: round.round_id,
        amount,
      });
  };

  return (
    <>
      <TokenCircleButton
        value={amount}
        loading={isLoading}
        disabled={!canAfford || disabled}
        onPress={async () => {
          if (hasPreviouslyBid) {
            await placeBidInRound();
          } else {
            setShowModal(true);
          }
        }}
      />
      <RaiseHandModal
        showModal={showModal}
        isPending={isPlacingBid}
        closeModal={() => {
          setShowModal(false);
        }}
        onReadyPress={async () => {
          await placeBidInRound();
          setShowModal(false);
        }}
      />
    </>
  );
}
