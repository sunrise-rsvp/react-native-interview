import useGetExtensionInfo from '@hooks/useGetExtensionInfo';
import TokenCircleButton from '@molecules/TokenCircleButton';
import {
  useCommitToExtension,
  useGetCurrentExtensionRound,
} from '@queries/extensions';
import { useGetUserTokens } from '@queries/tokens';
import React from 'react';

type Props = {
  factor?: number;
};

export default function ExtensionCircleButton({ factor = 1 }: Props) {
  const { data: round, isLoading: isLoadingRound } =
    useGetCurrentExtensionRound();
  const { data: tokens, isLoading: isLoadingTokens } = useGetUserTokens();
  const { mutateAsync: commitToExtension, isPending } = useCommitToExtension();
  const {
    isLoading: isLoadingExtensionInfo,
    currentCommitment,
    leftToCommit = 0,
    isExtensionOpen,
  } = useGetExtensionInfo();

  const isLoading =
    isLoadingRound ||
    isLoadingExtensionInfo ||
    isLoadingTokens ||
    !isExtensionOpen;

  const amountToCommit = Math.ceil(leftToCommit / factor);
  const canAfford = (tokens?.count ?? 0) >= amountToCommit;

  return (
    <TokenCircleButton
      value={amountToCommit}
      loading={isLoading || isPending}
      disabled={!canAfford}
      onPress={async () => {
        if (round)
          await commitToExtension({
            roundId: round.round_id,
            value: amountToCommit,
            newTotal: amountToCommit + (currentCommitment ?? 0),
          });
      }}
    />
  );
}
