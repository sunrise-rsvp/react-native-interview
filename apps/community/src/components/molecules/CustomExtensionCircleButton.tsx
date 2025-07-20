import useGetExtensionInfo from '@hooks/useGetExtensionInfo';
import CustomCircleButton from '@molecules/CustomCircleButton';
import {
  useCommitToExtension,
  useGetCurrentExtensionRound,
} from '@queries/extensions';
import { useGetUserTokens } from '@queries/tokens';
import React from 'react';
import { number, object } from 'yup';

const schema = object().shape({
  amount: number()
    .required()
    .integer('Not a valid amount')
    .min(1, 'Not a valid amount')
    .typeError('Not a valid amount')
    .test(
      'is-less-than-leftToCommit',
      'Too many tokens',
      (value, context) => value <= context.options.context?.leftToCommit,
    )
    .test(
      'is-less-than-available',
      'Not enough tokens',
      (value, context) => value <= context.options.context?.tokenCount,
    ),
});

export default function CustomExtensionCircleButton() {
  const { data: tokens, isLoading: isLoadingTokens } = useGetUserTokens();
  const {
    isLoading: isLoadingExtensionInfo,
    leftToCommit = 0,
    currentCommitment = 0,
    isExtensionOpen,
  } = useGetExtensionInfo();
  const { data: round } = useGetCurrentExtensionRound();
  const { mutateAsync: commitToExtension } = useCommitToExtension();

  const isLoading =
    !round || isLoadingTokens || isLoadingExtensionInfo || !isExtensionOpen;

  return (
    <CustomCircleButton
      onSubmit={async ({ amount }) => {
        if (round)
          await commitToExtension({
            roundId: round.round_id,
            value: amount,
            newTotal: currentCommitment + amount,
          });
      }}
      schema={schema}
      context={{ leftToCommit, tokenCount: tokens?.count ?? 0 }}
      loading={isLoading}
      buttonLabel="Contribute"
    />
  );
}
