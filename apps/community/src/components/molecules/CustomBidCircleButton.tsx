import useBidHistory from '@contexts/useBidHistory';
import CustomCircleButton from '@molecules/CustomCircleButton';
import RaiseHandModal from '@molecules/RaiseHandModal';
import {
  useGetCurrentAuctionRound,
  useGetHighestBid,
  usePlaceBid,
} from '@queries/auctions';
import { useGetUserTokens } from '@queries/tokens';
import React, { useState } from 'react';
import { number, object } from 'yup';

const schema = object().shape({
  amount: number()
    .required()
    .integer('Not a valid amount')
    .min(1, 'Not a valid amount')
    .typeError('Not a valid amount')
    .test(
      'is-less-than-current-bid',
      'Lower than current bid',
      (value, context) => value > context.options.context?.highestBid,
    )
    .test(
      'is-less-than-available',
      'Not enough tokens',
      (value, context) => value <= context.options.context?.tokenCount,
    ),
});

type Props = {
  disabled?: boolean;
};

export default function CustomBidCircleButton({ disabled }: Props) {
  const { hasPreviouslyBid } = useBidHistory();
  const { data: tokens, isLoading: isLoadingTokens } = useGetUserTokens();
  const { data: highestBid, isLoading: isLoadingHighestBid } =
    useGetHighestBid();
  const { data: round, isLoading: isLoadingRound } =
    useGetCurrentAuctionRound();
  const { mutateAsync: placeBid, isPending: isPlacingBid } = usePlaceBid();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState<number>();

  const isLoading =
    isLoadingTokens || isLoadingHighestBid || isLoadingRound || !round;
  const placeBidInRound = async () => {
    if (round && amount)
      await placeBid({
        roundId: round.round_id,
        amount,
      });
  };

  return (
    <>
      <CustomCircleButton
        onSubmit={async ({ amount }) => {
          if (hasPreviouslyBid) {
            await placeBidInRound();
          } else {
            setAmount(amount);
            setShowModal(true);
          }
        }}
        schema={schema}
        context={{
          highestBid: highestBid?.amount ?? 0,
          tokenCount: tokens?.count ?? 0,
        }}
        loading={isLoading}
        buttonLabel="Bid"
        disabled={disabled}
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
